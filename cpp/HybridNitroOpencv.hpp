#pragma once
#include <vector>
#include "HybridNitroOpencvSpec.hpp"
#include <opencv2/opencv.hpp>

namespace margelo::nitro::nitroopencv {
class HybridNitroOpencv : public HybridNitroOpencvSpec {
    public:
        HybridNitroOpencv() : HybridObject(TAG), HybridNitroOpencvSpec() {}
       
        double sum(double a, double b) override;
        std::string grayScaleImage(const std::string& imagePath) override;
        std::shared_ptr<ArrayBuffer> nativeGrayScale(const std::shared_ptr<ArrayBuffer>& frameData, double width, double height) override;
        std::shared_ptr<ArrayBuffer> getRGBABuffer(const std::shared_ptr<ArrayBuffer>& buffer, double width, double height) override;
} // namespace margelo::nitro::nitroopencv
