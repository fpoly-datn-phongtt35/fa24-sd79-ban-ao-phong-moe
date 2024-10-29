package sd79.dto.requests;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Builder
public class PromotionRequest {

    @NotNull(message = "Name cannot be null")
    @NotEmpty(message = "Name cannot be empty")
    @Size(max = 100, message = "Name should not exceed 100 characters")
    private String name;

    @NotNull(message = "Promotion value is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Promotion value must be greater than zero")
    private BigDecimal promotionValue;

    @NotNull(message = "Start date is required")
//    @FutureOrPresent(message = "Start date must be in the present or future")
    private Date startDate;

    @NotNull(message = "End date is required")
//    @Future(message = "End date must be in the future")
    private Date endDate;

    @Size(max = 255, message = "Description should not exceed 255 characters")
    private String description;

    private Long productID;

    private BigDecimal promotionPrice;
}
