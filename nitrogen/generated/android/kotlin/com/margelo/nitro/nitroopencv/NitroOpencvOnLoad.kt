///
/// NitroOpencvOnLoad.kt
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

package com.margelo.nitro.nitroopencv

import android.util.Log

internal class NitroOpencvOnLoad {
  companion object {
    private const val TAG = "NitroOpencvOnLoad"
    private var didLoad = false
    /**
     * Initializes the native part of "NitroOpencv".
     * This method is idempotent and can be called more than once.
     */
    @JvmStatic
    fun initializeNative() {
      if (didLoad) return
      try {
        Log.i(TAG, "Loading NitroOpencv C++ library...")
        System.loadLibrary("NitroOpencv")
        Log.i(TAG, "Successfully loaded NitroOpencv C++ library!")
        didLoad = true
      } catch (e: Error) {
        Log.e(TAG, "Failed to load NitroOpencv C++ library! Is it properly installed and linked? " +
                    "Is the name correct? (see `CMakeLists.txt`, at `add_library(...)`)", e)
        throw e
      }
    }
  }
}
