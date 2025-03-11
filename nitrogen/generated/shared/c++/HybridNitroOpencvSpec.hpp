///
/// HybridNitroOpencvSpec.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#if __has_include(<NitroModules/HybridObject.hpp>)
#include <NitroModules/HybridObject.hpp>
#else
#error NitroModules cannot be found! Are you sure you installed NitroModules properly?
#endif

// Forward declaration of `ArrayBuffer` to properly resolve imports.
namespace NitroModules { class ArrayBuffer; }

#include <NitroModules/ArrayBuffer.hpp>
#include <string>

namespace margelo::nitro::nitroopencv {

  using namespace margelo::nitro;

  /**
   * An abstract base class for `NitroOpencv`
   * Inherit this class to create instances of `HybridNitroOpencvSpec` in C++.
   * You must explicitly call `HybridObject`'s constructor yourself, because it is virtual.
   * @example
   * ```cpp
   * class HybridNitroOpencv: public HybridNitroOpencvSpec {
   * public:
   *   HybridNitroOpencv(...): HybridObject(TAG) { ... }
   *   // ...
   * };
   * ```
   */
  class HybridNitroOpencvSpec: public virtual HybridObject {
    public:
      // Constructor
      explicit HybridNitroOpencvSpec(): HybridObject(TAG) { }

      // Destructor
      ~HybridNitroOpencvSpec() override = default;

    public:
      // Properties
      

    public:
      // Methods
      virtual std::shared_ptr<ArrayBuffer> nativeGrayScale(const std::shared_ptr<ArrayBuffer>& frameData, double width, double height) = 0;
      virtual double sum(double num1, double num2) = 0;
      virtual std::string grayScaleImage(const std::string& imagePath) = 0;
      virtual std::shared_ptr<ArrayBuffer> getRGBABuffer(const std::shared_ptr<ArrayBuffer>& buffer, double width, double height) = 0;

    protected:
      // Hybrid Setup
      void loadHybridMethods() override;

    protected:
      // Tag for logging
      static constexpr auto TAG = "NitroOpencv";
  };

} // namespace margelo::nitro::nitroopencv
