package sd79.service;

import sd79.dto.requests.PromotionRequest;
import sd79.dto.response.PromotionResponse;

import java.util.List;

public interface PromotionService {
    List<PromotionResponse> getAllPromotion();

    Integer storePromotion(PromotionRequest req);

    void isDeletePromotion(Integer id);
}
