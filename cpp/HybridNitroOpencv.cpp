#include "HybridNitroOpencv.hpp"
#include <string>
#include <android/log.h>
#include <memory>

namespace margelo::nitro::nitroopencv {

#define TAG "NitroOpencv-JNI"
#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__)

    double HybridNitroOpencv::sum(double a, double b) {
        return a + b;
    }

    std::string HybridNitroOpencv::grayScaleImage(const std::string &imagePath) {
        std::string processedImagePath = imagePath; // Start with the original path

        // Check if the path starts with "file://" and remove it if it does.
        if (imagePath.rfind("file://", 0) == 0) {
            processedImagePath = imagePath.substr(7); // Remove "file://" (7 characters)
            __android_log_print(ANDROID_LOG_DEBUG, TAG, "Removed 'file://' prefix. Path is now: %s", processedImagePath.c_str());
        } else {
            __android_log_print(ANDROID_LOG_DEBUG, TAG, "Path does not have 'file://' prefix: %s", imagePath.c_str());
        }

        cv::Mat image = cv::imread(processedImagePath);
        if (image.empty()) {
            __android_log_print(ANDROID_LOG_ERROR, TAG, "cv::imread failed to load image: %s", processedImagePath.c_str());
            return "";
        }

        cv::Mat grayImage;
        cv::cvtColor(image, grayImage, cv::COLOR_BGR2GRAY);

        std::string grayImagePath = processedImagePath + "_gray.jpg";
        cv::imwrite(grayImagePath, grayImage);

        if (!cv::haveImageReader(grayImagePath)) {
            __android_log_print(ANDROID_LOG_ERROR, TAG, "cv::haveImageReader failed for: %s", grayImagePath.c_str());
            return "";
        }

        return "file://" + grayImagePath;
    }

    std::shared_ptr<ArrayBuffer>
    HybridNitroOpencv::nativeGrayScale(const std::shared_ptr<ArrayBuffer> &frameData, double width, double height) {
        LOGD("nativeConvertToRGBA: start");
    
        int w = static_cast<int>(width);
        int h = static_cast<int>(height);
    
        if (w <= 0 || h <= 0) {
            LOGE("Invalid dimensions: width %d height %d", w, h);
            return nullptr;
        }
    
        // Create a YUV Mat from NV21 frame data.
        cv::Mat yuv(h + h / 2, w, CV_8UC1, frameData->data());
    
        // Convert YUV ➡️ RGBA.
        cv::Mat rgba;
        cv::cvtColor(yuv, rgba, cv::COLOR_YUV2RGBA_NV21);
    
        if (!rgba.isContinuous()) {
            rgba = rgba.clone();
        }
    
        size_t newSize = rgba.total() * rgba.elemSize();
        LOGD("nativeConvertToRGBA: converted to RGBA with size %zu", newSize);
    
        std::shared_ptr<ArrayBuffer> newBuffer = ArrayBuffer::allocate(newSize);
        if (!newBuffer || !newBuffer->data()) {
            LOGE("Failed to allocate new ArrayBuffer of size %zu", newSize);
            return nullptr;
        }
    
        memcpy(newBuffer->data(), rgba.data, newSize);
    
        LOGD("nativeConvertToRGBA: end");
        return newBuffer;
    }

    std::shared_ptr<ArrayBuffer>
    HybridNitroOpencv::getRGBABuffer(const std::shared_ptr<ArrayBuffer> &buffer, double originalWidth, double originalHeight) {

//        clean the buffer
//        jsi::Object thisObject = thisArg.asObject(runtime);
//        thisObject.setNativeState(runtime, nullptr);
        LOGD("getRGBABuffer: start");
        // Check if the input buffer is valid.
        if (!buffer || !buffer->data() || buffer->size() <= 0) {
            LOGE("getRGBABuffer: invalid input buffer");
            return nullptr;
        }
        //use original width, original height
        int width = static_cast<int>(originalWidth);
        int height = static_cast<int>(originalHeight);
        // Assuming NV21 format for the input buffer.
        // For NV21, the total size is width * height * 1.5
        // Create a cv::Mat object from the input buffer, interpreting it as NV21 format.
        cv::Mat yuv(height + height / 2, width, CV_8UC1, const_cast<unsigned char*>(buffer->data()));

        // Create an empty cv::Mat object to store the RGBA image.
        cv::Mat rgba;
        // Convert the YUV image to RGBA format.
        cv::cvtColor(yuv, rgba, cv::COLOR_YUV2RGBA_NV21);
        // Release the memory occupied by the YUV image.
        yuv.release(); 

        // Check if the RGBA image is continuous in memory.
        if (!rgba.isContinuous()) {
            // If not continuous, clone the image to make it continuous.
            cv::Mat temp = rgba.clone();
            // Release the memory occupied by the original non-continuous RGBA image.
            rgba.release(); 
            // Assign the continuous clone to the RGBA variable.
            rgba = temp;
        }

        // Calculate the size of the RGBA image in bytes.
        size_t rgbaSize = rgba.total() * rgba.elemSize();
        // Allocate a new ArrayBuffer to store the RGBA image data.
        std::shared_ptr<ArrayBuffer> rgbaBuffer = ArrayBuffer::allocate(rgbaSize);
        // Check if the allocation was successful.
        if (!rgbaBuffer || !rgbaBuffer->data()) {
            LOGE("getRGBABuffer: failed to allocate RGBA buffer of size %zu", rgbaSize);
            return nullptr;
        }
        // Copy the RGBA image data to the newly allocated ArrayBuffer.
        memcpy(rgbaBuffer->data(), rgba.data, rgbaSize);
        // Release the memory occupied by the RGBA image.
        rgba.release();
        LOGD("getRGBABuffer: end, size: %zu", rgbaSize);

        // clean the buffer
        

        // Return the ArrayBuffer containing the RGBA image data.
        return rgbaBuffer;
    }

} // namespace margelo::nitro::nitroopencv
