#include "HybridNitroOpencv.hpp"
#include <opencv2/opencv.hpp>
#include <string> // Make sure to include <string> for string operations
#include <android/log.h> // For logging

namespace margelo::nitro::nitroopencv {

#define TAG "NitroOpencv-JNI"

    double HybridNitroOpencv::sum(double a, double b) {
        return a + b;
    }

    std::string HybridNitroOpencv::grayScaleImage(const std::string &imagePath) {
        std::string processedImagePath = imagePath; // Start with the original path

        // Check if the path starts with "file://" and remove it if it does
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

} // namespace margelo::nitro::nitroopencv