import { NitroModules } from 'react-native-nitro-modules'
import type { NitroOpencv as NitroOpencvSpec } from './specs/nitro-opencv.nitro'

export const NitroOpencv =
  NitroModules.createHybridObject<NitroOpencvSpec>('NitroOpencv')