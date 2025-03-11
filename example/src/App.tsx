import React, { useEffect, useMemo, useState } from 'react';
import {
  AlphaType,
  Canvas,
  ColorType,
  Image ,
  Skia,
  type SkImage,
} from '@shopify/react-native-skia';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { NitroModules } from 'react-native-nitro-modules';
import { NitroOpencv } from 'react-native-nitro-opencv';
import {
  Camera,
  createFrameProcessor,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { nitroOpencvFactory } from '../../src/specs/nitro-opencv.nitro';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import GalleryUpload from './GalleryUpload';

const SCREEN_WIDTH = 640

const App = () => {
  const device = useCameraDevice('back');
  const {resize} = useResizePlugin()
  const { hasPermission, requestPermission } = useCameraPermission();

  // const [previewImage, setPreviewImage] = useState<SkImage | null>(null);

  // Shared Values for dimensions and preview image
  const frameWidth = useSharedValue(640);
  const frameHeight = useSharedValue(480);
  const previewImageShared = useSharedValue<SkImage | null>(null);

  const [dimensions, setDimensions] = useState({
    width: 640,
    height: 480,
  });

  useEffect(() => {
    requestPermission();
    // return () => {
    //   // Cleanup when unmounting
    //   if (previewImage) {
    //     previewImage.dispose();
    //   }
    // };
  }, []);

  // Update dimensions reactively
  useAnimatedReaction(
    () => ({ width: frameWidth.value, height: frameHeight.value }),
    (current, prev) => {
      if (
        !prev ||
        current.width !== prev.width ||
        current.height !== prev.height
      ) {
        runOnJS(setDimensions)(current);
      }
    },
    []
  );

  // Sync SkImage updates and dispose previous
  // useAnimatedReaction(
  //   () => previewImageShared.value,
  //   (currentImage, prevImage) => {
  //     if (prevImage && prevImage !== currentImage) {
  //       prevImage.dispose();
  //     }
  //     if (currentImage !== previewImage) {
  //       runOnJS(setPreviewImage)(currentImage);
  //     }
  //   },
  //   [previewImageShared]
  // );

  const boxedNitroOpencv = NitroModules.box(NitroOpencv)
  // const boxedNitroOpencv = NitroModules.box(NitroOpencv)

 
  // console.log(boxedNitroOpencv.unbox().name)
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
      console.log(`Frame width: ${frame.width}, height: ${frame.height} bytesperrow ${frame.bytesPerRow}`)
      // NitroOpencv.testFn(frame)
      const frameData = frame.toArrayBuffer();
      const unBoxedNitroOpencv = boxedNitroOpencv.unbox()
      
      // console.log()
      // unBoxedNitroOpencv.clearBuffer()
      // const resizedFrameData = resize(
      //   frame,
      //   {
      //     scale: {
      //       width: frame.width,
      //       height: frame.height
      //     },
      //     dataType: "uint8",
      //     pixelFormat: 'rgb',
      //     rotation: '90deg',
      //   }
      // )

      // const test = unBoxedNitroOpencv.grayScaleImage("file:///data/user/0/com.nitroopencvexample/cache/rn_image_picker_lib_temp_de0a4c97-3aeb-49ff-a3a7-720d65d64df0.jpg")
      // console.log(test)
      const rgbaBuffer = unBoxedNitroOpencv.getRGBABuffer(
        frameData,
        frame.width,
        frame.height
      );

      // unBoxedNitroOpencv.clearBuffer(55, false, 'hello', { obj: true })
      // rgbaBuffer.
      // unBoxedNitroOpencv.dispose()
      // const expectedLength = frame.width * frame.height * 4;
      // if (grayScaled.byteLength !== expectedLength) {
      //   throw new Error(
      //     `Expected ${expectedLength} bytes, got ${grayScaled.byteLength}`
      //   );
      // }

      // const uint8Array = new Uint8Array(rgbaBuffer);
      
      // const skData = Skia.Data.fromBytes(resizedFrameData);
      // const rowBytes = frame.width * 4;
      // // previewImageShared.value?.dispose();
      // const image = Skia.Image.MakeImage(
      //   {
      //     width: frame.width,
      //     height: frame.height,
      //     colorType: ColorType.RGB_888x,
      //     alphaType: AlphaType.Opaque,

      //   },
      //   skData,
      //   rowBytes
      // );

      // skData.dispose();

      // // if (!image) {
      // //   throw new Error('Failed to create SkImage');
      // // }

      // // // Update shared values (triggers useAnimatedReaction)
      // previewImageShared.value?.dispose()
      // frameWidth.value = frame.width;
      // frameHeight.value = frame.height;
      // previewImageShared.value = image;
      // console.log(image?.getImageInfo())
      // image?.dispose()
      // return 
  },[]);

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No camera permission</Text>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No camera device found</Text>
      </SafeAreaView>
    );
  }

  const displayScale = SCREEN_WIDTH / dimensions.width;
  const displayWidth = SCREEN_WIDTH;
  const displayHeight = dimensions.height * displayScale;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Camera Preview */}
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            device={device}
            isActive={true}
            pixelFormat="yuv"
            frameProcessor={frameProcessor}
            enableFpsGraph={__DEV__}
          />
        </View>

        {/* Processed Image Preview */}
        <View style={styles.canvasContainer}>
          <Canvas
            style={{
              width: 640,
              height: 480,
              borderColor: 'red',
              borderWidth: 2,
            }}
          >

            {/* {previewImage && ( */}
              <Image
                image={previewImageShared.value}
                x={0}
                y={0}
                width={640}
                height={480}
                fit="contain"
              />
            {/* )} */}
          </Canvas>
        </View>
        {/* <GalleryUpload/> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  canvasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
