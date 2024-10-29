package sd79.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sd79.dto.requests.PromotionProductReq;
import sd79.dto.requests.PromotionRequest;
import sd79.dto.response.PromotionResponse;

import java.util.Date;
import java.util.List;

public interface PromotionService {
    List<PromotionResponse> getAllPromotion();
    PromotionResponse getPromotionId(Integer id);
    Integer storePromotion(PromotionRequest promotionRequest);
    Integer storeProductPromotion(PromotionProductReq promotionProductReq);
    Integer updatePromotion(PromotionRequest req, Integer id);
    void isDeletePromotion(Integer id);
//    Integer storePromotionProduct(PromotionProductReq request);
    Page<PromotionResponse> searchPromotions(Date startDate, Date endDate, String name, Pageable pageable);
    Page<PromotionResponse> findByKeywordAndDate(String keyword, Date startDate, Date endDate, String status, Pageable pageable);
}
