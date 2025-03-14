import {
  AlphaType,
  Canvas,
  ColorType,
  Image,
  Skia,
  type SkData,
  type SkImage,
} from '@shopify/react-native-skia';
import {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {NitroModules} from 'react-native-nitro-modules';
import {NitroOpencv} from 'react-native-nitro-opencv';

import {useSharedValue} from 'react-native-reanimated';
import {
  Camera,
  runAtTargetFps,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {useRunOnJS} from 'react-native-worklets-core';
import {useResizePlugin, type Options} from 'vision-camera-resize-plugin';

type PixelFormat = Options<'uint8'>['pixelFormat'];

const WIDTH = 300;
const HEIGHT = 300;
const TARGET_TYPE = 'uint8' as const;
const TARGET_FORMAT: PixelFormat = 'rgba';

let lastWarn: PixelFormat | undefined;
lastWarn = undefined;
function warnNotSupported(pixelFormat: PixelFormat) {
  if (lastWarn !== pixelFormat) {
    console.log(
      `Pixel Format '${pixelFormat}' is not natively supported by Skia! ` +
        `Displaying a fall-back format that might use wrong colors instead...`,
    );
    lastWarn = pixelFormat;
  }
}

function getSkiaTypeForPixelFormat(pixelFormat: PixelFormat): ColorType {
  switch (pixelFormat) {
    case 'abgr':
    case 'argb':
      warnNotSupported(pixelFormat);
      return ColorType.RGBA_8888;
    case 'bgr':
      warnNotSupported(pixelFormat);
      return ColorType.RGB_888x;
    case 'rgb':
      return ColorType.RGB_888x;
    case 'rgba':
      return ColorType.RGBA_8888;
    case 'bgra':
      return ColorType.BGRA_8888;
  }
}
function getComponentsPerPixel(pixelFormat: PixelFormat): number {
  switch (pixelFormat) {
    case 'abgr':
    case 'rgba':
    case 'bgra':
    case 'argb':
      return 4;
    case 'rgb':
    case 'bgr':
      return 3;
  }
}

export function createSkiaImageFromData(
  data: SkData,
  width: number,
  height: number,
  pixelFormat: PixelFormat,
): SkImage | null {
  const componentsPerPixel = getComponentsPerPixel(pixelFormat);
  return Skia.Image.MakeImage(
    {
      width: width,
      height: height,
      alphaType: AlphaType.Unpremul,
      colorType: getSkiaTypeForPixelFormat(pixelFormat),
    },
    data,
    width * componentsPerPixel,
  );
}

export function CamPassthrough() {
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const previewImage = useSharedValue<SkImage | null>(null);
  const {resize} = useResizePlugin();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const updatePreviewImageFromData = useRunOnJS(
    (data: SkData, pixelFormat: PixelFormat) => {
      const image = createSkiaImageFromData(data, WIDTH, HEIGHT, pixelFormat);
      if (image == null) {
        throw new Error('Failed to create Skia image from data');
      }
      previewImage.value?.dispose();
      previewImage.value = image;
    },
    [],
  );
  const boxedNitroOpencv = NitroModules.box(NitroOpencv);
  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      runAtTargetFps(1, () => {
              'worklet'
        console.log("frame", frame.width, frame.height)

      const unBoxedNitroOpencv = boxedNitroOpencv.unbox();
      const initializeStatus = unBoxedNitroOpencv.initializeBuffer(
        frame.toArrayBuffer(),
        frame.width,
        frame.height,
      );
    //   console.log('initializeStatus', initializeStatus);
      let rgbaBuffer = unBoxedNitroOpencv.getRGBABufferFromStored();
      const buffer = new Uint8Array(rgbaBuffer)
      const data = Skia.Data.fromBytes(buffer);

      updatePreviewImageFromData(data, TARGET_FORMAT).then(() => {
        console.log("updatePreviewImageFromData .then")
        data.dispose();
      });
      data.dispose();
      unBoxedNitroOpencv.releaseStoredBuffer()
     
    })
    },
    [updatePreviewImageFromData],
  );

  if (!hasPermission) {
    return <Text>No permission</Text>;
  }

  if (device == null) {
    return <Text>No device</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        enableFpsGraph
        isActive={true}
        pixelFormat="yuv"
        frameProcessor={frameProcessor}
      />
      <SafeAreaView style={styles.safe}>
        <Canvas style={styles.canvas}>
          <Image
            image={previewImage}
            x={0}
            y={0}
            width={WIDTH}
            height={HEIGHT}
            fit="contain"
          />
        </Canvas>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safe: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  canvas: {
    width: WIDTH,
    height: HEIGHT,
    borderColor: 'red',
    borderWidth: 2,
  },
});
