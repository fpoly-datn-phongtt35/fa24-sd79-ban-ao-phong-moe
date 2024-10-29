package sd79.dto.requests;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.Date;
@Getter
@Builder

public class PromotionProductReq {
    private Long productID;
    private Integer promotionID;
    private BigDecimal promotionPrice;
}
