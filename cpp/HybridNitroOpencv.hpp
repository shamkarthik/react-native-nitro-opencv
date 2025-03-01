#pragma once
#include <vector>
#include "HybridNitroOpencvSpec.hpp"

namespace margelo::nitro::nitroopencv {
class HybridNitroOpencv : public HybridNitroOpencvSpec {
    public:
        HybridNitroOpencv() : HybridObject(TAG), HybridNitroOpencvSpec() {}
       
        double sum(double a, double b) override;
    };
} // namespace margelo::nitro::nitroopencv
