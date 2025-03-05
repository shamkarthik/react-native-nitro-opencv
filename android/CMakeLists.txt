project(NitroOpencv)
cmake_minimum_required(VERSION 3.9.0)

set (PACKAGE_NAME NitroOpencv)
set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 20)

# --- OpenCV Configuration ---
# Set the path to your OpenCV Android SDK.
# **IMPORTANT: Replace "path/to/opencv-android-sdk" with the ACTUAL path**
message(STATUS "CMAKE_SOURCE_DIR path: ${CMAKE_SOURCE_DIR}")
set(OpenCV_DIR "${CMAKE_SOURCE_DIR}/../external/opencv-4.11.0-android-sdk/OpenCV-android-sdk/sdk/native/jni" CACHE PATH "OpenCV Android SDK JNI path")

find_package(OpenCV REQUIRED)

if(OpenCV_FOUND)
    message(STATUS "OpenCV library found: ${OpenCV_VERSION}")
    include_directories(${OpenCV_INCLUDE_DIRS})
else()
    message(FATAL_ERROR "OpenCV library NOT found. Check OpenCV_DIR in CMakeLists.txt.")
endif()
# --- End OpenCV Configuration ---

# Define C++ library and add all sources
add_library(${PACKAGE_NAME} SHARED 
	src/main/cpp/cpp-adapter.cpp
	../cpp/HybridNitroOpencv.cpp
	../cpp/HybridNitroOpencv.hpp
        
)

# Add Nitrogen specs :)
include(${CMAKE_SOURCE_DIR}/../nitrogen/generated/android/NitroOpencv+autolinking.cmake)

# Set up local includes
include_directories(
        "src/main/cpp"
        "../cpp"
)

find_library(LOG_LIB log)

# Link all libraries together
target_link_libraries(
        ${PACKAGE_NAME}
        ${LOG_LIB}
        ${OpenCV_LIBS}
        android                                   # <-- Android core
)
