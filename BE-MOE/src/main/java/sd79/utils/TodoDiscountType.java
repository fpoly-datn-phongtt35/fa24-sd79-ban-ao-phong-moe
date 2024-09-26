package com.example.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum TodoDiscountType {
    @JsonProperty("percentage")
    PERCENTAGE,

    @JsonProperty("pixed_amount")
    FIXED_AMOUNT,
}
