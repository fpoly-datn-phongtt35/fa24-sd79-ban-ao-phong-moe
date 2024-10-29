package sd79.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PromotionDetailResponse {
    private int id;

    private int promotionId;

    private Long productId;

}
