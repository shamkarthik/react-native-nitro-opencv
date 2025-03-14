#include "HybridNitroOpencv.hpp"
#include <string>
#include <android/log.h>
#include <memory>
#include <opencv2/opencv.hpp>

namespace margelo::nitro::nitroopencv {

#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__)

    HybridNitroOpencv::HybridNitroOpencv()
            : HybridObject(TAG), HybridNitroOpencvSpec() {
        LOGD("HybridNitroOpencv::HybridNitroOpencv()");
    }

    HybridNitroOpencv::~HybridNitroOpencv() {
        LOGD("HybridNitroOpencv::~HybridNitroOpencv()");
        releaseStoredBuffer();
    }

    double HybridNitroOpencv::sum(double a, double b) {
        LOGD("HybridNitroOpencv::sum(%f, %f)", a, b);
        return a + b;
    }

// ✅ Example grayscale image processor from file path (no changes here)
    std::string HybridNitroOpencv::grayScaleImage(const std::string &imagePath) {
        LOGD("HybridNitroOpencv::grayScaleImage(%s)", imagePath.c_str());
        std::string processedImagePath = imagePath;

        if (imagePath.rfind("file://", 0) == 0) {
            processedImagePath = imagePath.substr(7);
            LOGD("Removed 'file://' prefix. Path is now: %s", processedImagePath.c_str());
        }

        cv::Mat image = cv::imread(processedImagePath);
        if (image.empty()) {
            LOGE("cv::imread failed to load image: %s", processedImagePath.c_str());
            return "";
        }

        cv::Mat grayImage;
        cv::cvtColor(image, grayImage, cv::COLOR_BGR2GRAY);

        std::string grayImagePath = processedImagePath + "_gray.jpg";
        if (!cv::imwrite(grayImagePath, grayImage)) {
            LOGE("Failed to write grayscale image to: %s", grayImagePath.c_str());
            return "";
        }

        return "file://" + grayImagePath;
    }

    std::shared_ptr<ArrayBuffer> HybridNitroOpencv::nativeGrayScale(
            const std::shared_ptr<ArrayBuffer> &frameData, double width, double height) {

        LOGD("HybridNitroOpencv::nativeGrayScale: start");

        int w = static_cast<int>(width);
        int h = static_cast<int>(height);

        if (w <= 0 || h <= 0 || !frameData || !frameData->data()) {
            LOGE("nativeGrayScale: Invalid input - width=%d, height=%d", w, h);
            return nullptr;
        }

        // ✅ YUV NV21 data buffer
        cv::Mat yuv(h + h / 2, w, CV_8UC1, frameData->data());
        LOGD("nativeGrayScale: yuvMat rows=%d cols=%d", yuv.rows, yuv.cols);

        // ✅ Convert YUV -> RGBA
        cv::Mat rgba;
        cv::cvtColor(yuv, rgba, cv::COLOR_YUV2RGBA_NV21);

        if (rgba.empty()) {
            LOGE("nativeGrayScale: cvtColor failed");
            return nullptr;
        }

        if (!rgba.isContinuous()) {
            rgba = rgba.clone();
            LOGD("nativeGrayScale: Cloned to make continuous");
        }

        size_t newSize = rgba.total() * rgba.elemSize();
        LOGD("nativeGrayScale: newSize=%zu", newSize);

        auto newBuffer = ArrayBuffer::allocate(newSize);
        if (!newBuffer || !newBuffer->data()) {
            LOGE("nativeGrayScale: Failed to allocate ArrayBuffer");
            return nullptr;
        }

        memcpy(newBuffer->data(), rgba.data, newSize);

        LOGD("HybridNitroOpencv::nativeGrayScale: end");
        return newBuffer;
    }

    std::shared_ptr<ArrayBuffer> HybridNitroOpencv::getRGBABuffer(
            const std::shared_ptr<ArrayBuffer> &buffer, double originalWidth, double originalHeight) {

        LOGD("HybridNitroOpencv::getRGBABuffer: start");

        if (!initializeBuffer(buffer, originalWidth, originalHeight)) {
            LOGE("getRGBABuffer: Buffer initialization failed");
            return nullptr;
        }

        return getRGBABufferFromStored();
    }

    std::shared_ptr<ArrayBuffer> HybridNitroOpencv::getRGBABufferFromStored() {
        LOGD("HybridNitroOpencv::getRGBABufferFromStored: start");

        if (yuvMat.empty()) {
            LOGE("getRGBABufferFromStored: yuvMat is empty");
            return nullptr;
        }

        // ✅ Convert YUV to RGBA
        cv::cvtColor(yuvMat, rgbaMat, cv::COLOR_YUV2RGBA_NV21);

        if (rgbaMat.empty()) {
            LOGE("getRGBABufferFromStored: cvtColor failed");
            return nullptr;
        }

        if (!rgbaMat.isContinuous()) {
            rgbaMat = rgbaMat.clone();
            LOGD("getRGBABufferFromStored: Cloned to make continuous");
        }

        size_t rgbaSize = rgbaMat.total() * rgbaMat.elemSize();
        LOGD("getRGBABufferFromStored: rgbaSize=%zu (expected: %d)", rgbaSize, bufferWidth * bufferHeight * 4);

        if (rgbaSize != bufferWidth * bufferHeight * 4) {
            LOGE("getRGBABufferFromStored: Unexpected rgbaSize!");
        }

        // ✅ Allocate rgbaBuffer if necessary
        if (!rgbaBuffer || rgbaBuffer->size() != rgbaSize) {
            rgbaBuffer = ArrayBuffer::allocate(rgbaSize);
            if (!rgbaBuffer || !rgbaBuffer->data()) {
                LOGE("getRGBABufferFromStored: Failed to allocate rgbaBuffer");
                return nullptr;
            }
        }

        // ✅ Copy to output buffer
        memcpy(rgbaBuffer->data(), rgbaMat.data, rgbaSize);

        LOGD("getRGBABufferFromStored: end");
        return rgbaBuffer;
    }

    bool HybridNitroOpencv::initializeBuffer(
            const std::shared_ptr<ArrayBuffer> &buffer, double width, double height) {

        LOGD("HybridNitroOpencv::initializeBuffer: start");

        int w = static_cast<int>(width);
        int h = static_cast<int>(height);

        if (!buffer || w <= 0 || h <= 0) {
            LOGE("initializeBuffer: Invalid dimensions");
            releaseStoredBuffer();
            return false;
        }

        size_t expectedBufferSize = static_cast<size_t>(w * h * 1.5);
        LOGD("initializeBuffer: expectedBufferSize=%zu", expectedBufferSize);

        if (buffer->size() < expectedBufferSize) {
            LOGE("initializeBuffer: Buffer size (%zu) < expected (%zu)", buffer->size(), expectedBufferSize);
            releaseStoredBuffer();
            return false;
        }

        releaseStoredBuffer();

        bufferPtr = buffer;
        bufferWidth = w;
        bufferHeight = h;
        bufferSize = buffer->size();

        // ✅ Correct YUV Mat: rows = height + height/2, cols = width
        yuvMat = cv::Mat(h + h / 2, w, CV_8UC1, bufferPtr->data());

        LOGD("initializeBuffer: Initialized yuvMat (cols=%d rows=%d)", yuvMat.cols, yuvMat.rows);

        return true;
    }

    void HybridNitroOpencv::releaseStoredBuffer() {
        LOGD("HybridNitroOpencv::releaseStoredBuffer: start");

        yuvMat.release();
        rgbaMat.release();

        bufferPtr.reset();
        rgbaBuffer.reset();

        bufferSize = 0;
        bufferWidth = 0;
        bufferHeight = 0;

        LOGD("HybridNitroOpencv::releaseStoredBuffer: end");
    }

} // namespace margelo::nitro::nitroop
