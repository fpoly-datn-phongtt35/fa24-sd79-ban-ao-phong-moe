package sd79.service;

import sd79.dto.requests.PromotionRequest;
import sd79.dto.response.PromotionResponse;
import sd79.model.Promotion;

import java.util.Date;
import java.util.List;

public interface PromotionService {
    List<PromotionResponse> getAllPromotion();
    PromotionResponse getPromotionId(Integer id);
    Integer storePromotion(PromotionRequest promotionRequest);

    Integer updatePromotion(PromotionRequest req, Integer id);

    void isDeletePromotion(Integer id);

}
