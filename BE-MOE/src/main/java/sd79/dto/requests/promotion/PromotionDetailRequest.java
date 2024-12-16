package sd79.dto.requests.promotion;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder

public class PromotionDetailRequest {
    private Long productID;
    private Integer promotionID;
}
