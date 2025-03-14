import React, {useEffect, useMemo, useState} from 'react';
import {
  AlphaType,
  Canvas,
  ColorType,
  Image,
  Skia,
  type SkImage,
} from '@shopify/react-native-skia';
import {SafeAreaView, StyleSheet, Text, View, Dimensions} from 'react-native';
import {NitroModules} from 'react-native-nitro-modules';
import {NitroOpencv} from 'react-native-nitro-opencv';
import {
  Camera,
  createFrameProcessor,
  runAtTargetFps,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import {nitroOpencvFactory} from '../../src/specs/nitro-opencv.nitro';
import {useResizePlugin} from 'vision-camera-resize-plugin';
import GalleryUpload from './GalleryUpload';
import { CamPassthrough } from './CamPassthrough';

const SCREEN_WIDTH = 640;

const App = () => {
//   const device = useCameraDevice('back');
//   const {resize} = useResizePlugin();
//   const {hasPermission, requestPermission} = useCameraPermission();

//   // const [previewImage, setPreviewImage] = useState<SkImage | null>(null);

//   // Shared Values for dimensions and preview image
//   const frameWidth = useSharedValue(640);
//   const frameHeight = useSharedValue(480);
//   const previewImageShared = useSharedValue<SkImage | null>(null);

//   const [dimensions, setDimensions] = useState({
//     width: 640,
//     height: 480,
//   });

//   useEffect(() => {
//     requestPermission();
//     
//   }, []);


//   const boxedNitroOpencv = NitroModules.box(NitroOpencv);
//   const TARGET_FPS = 1
//   const frameProcessor = useFrameProcessor(frame => {
//     'worklet';
//     // console.log("I'm running synchronously at 60 FPS!")

//     runAtTargetFps(TARGET_FPS, () => {
//       'worklet'
//       console.log(
//         `Frame width: ${frame.width}, height: ${frame.height} bytesperrow ${frame.bytesPerRow} ${frame.toArrayBuffer().byteLength}`,
//       );
//       console.log("I'm running synchronously at 2 FPS!")


//       const unBoxedNitroOpencv = boxedNitroOpencv.unbox();
//       const initializeStatus = unBoxedNitroOpencv.initializeBuffer(frame.toArrayBuffer(), frame.width, frame.height);
//       console.log("initializeStatus",initializeStatus)
//       let rgbaBuffer = unBoxedNitroOpencv.getRGBABufferFromStored()
//       console.log("getRGBABufferFromStored",rgbaBuffer.byteLength)
//       if (rgbaBuffer.byteLength > 0) {
//         // console.log("RGBA Buffer Content:", new Uint8Array(rgbaBuffer).slice(0, 20)); // Log first 20 bytes
//       } else {
//         console.log("RGBA Buffer is empty!");
//       }


//       // rgbaBuffer = new ArrayBuffer()

//       const uint8Array = new Uint8Array(rgbaBuffer);

//       const skData = Skia.Data.fromBytes(uint8Array);
//       const rowBytes = frame.width * 4;
//       // // // previewImageShared.value?.dispose();
//       const image = Skia.Image.MakeImage(
//         {
//           width: frame.width,
//           height: frame.height,
//           colorType: ColorType.RGBA_8888,
//           alphaType: AlphaType.Opaque,

//         },
//         skData,
//         rowBytes
//       );

//       if (!image) {
//          console.error('Failed to create SkImage!'); // Uncommented error check
//       } else {
//         console.log("image", image?.getImageInfo())
//       }
//       unBoxedNitroOpencv.releaseStoredBuffer()


//       // if (!image) {
//       //   throw new Error('Failed to create SkImage');
//       // }

//       // // // Update shared values (triggers useAnimatedReaction)
//       previewImageShared.value?.dispose()
//       frameWidth.value = frame.width;
//       frameHeight.value = frame.height;
//       previewImageShared.value = image;
//       // console.log(image?.getImageInfo())
//       console.log(frameHeight.value, frameWidth.value, previewImageShared.value?.getImageInfo())


//       skData.dispose();
//       unBoxedNitroOpencv.releaseStoredBuffer()

//     })
//     // return
//   },[]);



//   if (!hasPermission) {
//     return (
//       <SafeAreaView style={styles.center}>
//         <Text>No camera permission</Text>
//       </SafeAreaView>
//     );
//   }

//   if (!device) {
//     return (
//       <SafeAreaView style={styles.center}>
//         <Text>No camera device found</Text>
//       </SafeAreaView>
//     );
//   }

//   const displayScale = SCREEN_WIDTH / dimensions.width;
//   const displayWidth = SCREEN_WIDTH;
//   const displayHeight = dimensions.height * displayScale;
// if(false)
//   return (
//     <SafeAreaView style={styles.safe}>
//       <View style={styles.container}>
//         {/* Camera Preview */}
//         <View style={styles.cameraContainer}>
//           <Camera
//             style={styles.camera}
//             device={device}
//             isActive={true}
//             pixelFormat="yuv"
//             frameProcessor={frameProcessor}
//             enableFpsGraph={__DEV__}
//           />
//         </View>

//        
//         <View style={styles.canvasContainer}>
//           <Canvas
//             style={{
//               width: 640,
//               height: 480,
//               borderColor: 'red',
//               borderWidth: 2,
//             }}>
//             <Image
//               image={previewImageShared.value}
//               x={0}
//               y={0}
//               width={640}
//               height={480}
//               fit="contain"
//             />
//           </Canvas>
//         </View>
//       </View>
//     </SafeAreaView>
//   );


return (
  <CamPassthrough/>
)
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