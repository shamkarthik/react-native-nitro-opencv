#include <jni.h>
#include "NitroOpencvOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::nitroopencv::initialize(vm);
}
