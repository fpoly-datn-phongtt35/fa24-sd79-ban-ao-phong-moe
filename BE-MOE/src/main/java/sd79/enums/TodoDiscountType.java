package sd79.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum TodoDiscountType {
    @JsonProperty("percentage")
    PERCENTAGE,

    @JsonProperty("fixed_amount")
    FIXED_AMOUNT,
}
