package sd79.dto.requests;

import jakarta.validation.constraints.FutureOrPresent;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;
import java.util.Set;


@Getter
@Builder
public class PromotionRequest {
    private String name;

    private String code;

    private Integer percent;

    @FutureOrPresent(message = "Start date must be in the present or future")
    private Date startDate;

    @FutureOrPresent(message = "Start date must be in the present or future")
    private Date endDate;

    private String note;

    private Set<Long> productIds;
}




//@NotNull(message = "Name cannot be null")
//@NotEmpty(message = "Name cannot be empty")
//@Size(max = 100, message = "Name should not exceed 100 characters")
//private String name;
//
//@NotNull(message = "Promotion value is required")
//private Integer percent;
//
//@NotNull(message = "Start date is required")
////    @FutureOrPresent(message = "Start date must be in the present or future")
//private Date startDate;
//
//@NotNull(message = "End date is required")
////    @Future(message = "End date must be in the future")
//private Date endDate;
//
//@Size(max = 255, message = "Description should not exceed 255 characters")
//private String description;
//
//private Long productID;
//
//private BigDecimal promotionPrice;