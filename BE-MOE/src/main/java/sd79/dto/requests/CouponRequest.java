package sd79.dto.requests;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import sd79.enums.TodoDiscountType;
import sd79.enums.TodoType;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Builder
public class CouponRequest {

    @NotNull(message = "Code cannot be null")
    @NotEmpty(message = "Code cannot be empty")
    @Size(max = 100, message = "Code should not exceed 100 characters")
    private String code;

    @NotNull(message = "Name cannot be null")
    @NotEmpty(message = "Name cannot be empty")
    @Size(max = 100, message = "Name should not exceed 100 characters")
    private String name;

    @NotNull(message = "Discount type is required")
    private TodoDiscountType discountType;

    @NotNull(message = "Discount value is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Discount value must be greater than zero")
    private BigDecimal discountValue;

    @NotNull(message = "Minimum order value is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Minimum order value must be greater than zero")
    private BigDecimal maxValue;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Conditions order value is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Minimum order value must be greater than zero")
    private BigDecimal conditions;

    @NotNull(message = "Type is required")
    private TodoType type;

    @NotNull(message = "Start date is required")
    private Date startDate;

    @NotNull(message = "End date is required")
    private Date endDate;

    @Size(max = 255, message = "Description should not exceed 255 characters")
    private String description;

    @NotNull(message = "User id must be not null!")
    private Long userId;
}
