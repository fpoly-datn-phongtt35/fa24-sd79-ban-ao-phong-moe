package sd79.dto.requests;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder

public class PromotionDetailRequest {
    private Long productID;
    private Integer promotionID;
}
