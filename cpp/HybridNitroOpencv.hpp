#pragma once
#include <vector>
#include "HybridNitroOpencvSpec.hpp" // Assuming HybridNitroOpencvSpec.hpp exists
#include <opencv2/opencv.hpp>
#include <jsi/jsi.h> // Include for jsi::Value
#include <memory> // Include for std::shared_ptr

namespace margelo::nitro::nitroopencv {
    class HybridNitroOpencv : public HybridNitroOpencvSpec {
    public:
        HybridNitroOpencv(); // Constructor declaration
        ~HybridNitroOpencv() override; // Destructor declaration

        bool initializeBuffer(const std::shared_ptr<ArrayBuffer>& buffer, double width, double height) override;
        double sum(double a, double b) override;
        std::string grayScaleImage(const std::string& imagePath) override;
        std::shared_ptr<ArrayBuffer> nativeGrayScale(const std::shared_ptr<ArrayBuffer>& frameData, double width, double height) override;
        std::shared_ptr<ArrayBuffer> getRGBABuffer(const std::shared_ptr<ArrayBuffer>& buffer, double width, double height) override;
        std::shared_ptr<ArrayBuffer> getRGBABufferFromStored() override; // Declaration for getRGBABufferFromStored
        void releaseStoredBuffer() override;

    private:
        cv::Mat yuvMat;
        cv::Mat rgbaMat;
        std::shared_ptr<ArrayBuffer> bufferPtr; // Store the original ArrayBuffer if needed
        size_t bufferSize;
        int bufferWidth; // Corrected member name
        int bufferHeight; // Corrected member name
        std::shared_ptr<ArrayBuffer> rgbaBuffer;
         // Declaration for releaseStoredBuffer
    };
} // namespace margelo::nitro::nitroopencv