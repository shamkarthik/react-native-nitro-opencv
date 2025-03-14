import { NitroModules, type HybridObject } from 'react-native-nitro-modules'


export interface NitroOpencv extends HybridObject<{ ios: 'c++', android: 'c++' }> {
  initializeBuffer(buffer:ArrayBuffer,width: number, height: number): boolean
  nativeGrayScale(frameData: ArrayBuffer, width: number, height: number): ArrayBuffer
  sum(num1: number, num2: number): number
  grayScaleImage(imagePath:string): string
  getRGBABuffer(buffer:ArrayBuffer,width: number, height: number): ArrayBuffer
  getRGBABufferFromStored():ArrayBuffer
  releaseStoredBuffer():void
}

export const nitroOpencvFactory = NitroModules.box(NitroModules.createHybridObject<NitroOpencv>("NitroOpencv"))
