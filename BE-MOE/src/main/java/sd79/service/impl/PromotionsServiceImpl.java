package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sd79.dto.requests.PromotionProductReq;
import sd79.dto.requests.PromotionRequest;
import sd79.dto.response.PromotionDetailResponse;
import sd79.dto.response.PromotionResponse;
import sd79.exception.EntityNotFoundException;
import sd79.model.Product;
import sd79.model.Promotion;
import sd79.model.PromotionDetail;
import sd79.model.User;
import sd79.repositories.auth.UserRepository;
import sd79.repositories.products.ProductRepository;
import sd79.repositories.promotions.PromotionDetailRepository;
import sd79.repositories.promotions.PromotionRepository;
import sd79.service.PromotionService;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionsServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;

    private final PromotionDetailRepository promotionDetailRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    @Override
    public List<PromotionResponse> getAllPromotion() {
        return this.promotionRepository.findAll().stream().map(item ->
                PromotionResponse.builder()
                        .id(item.getId())
                        .name(item.getName())
                        .code(item.getCode())
                        .percent(item.getPercent())
                        .startDate(item.getStartDate())
                        .endDate(item.getEndDate())
                        .note(item.getNote())
                        .status("TODO")
                        .numberOfProduct(10)
                        .build()
        ).toList();
    }

    @Override
    public PromotionResponse getPromotionId(Integer id) {
        return null;
    }

    @Override
    public List<PromotionDetailResponse> getAllPromotionDetail(){
        return this.promotionDetailRepository.findAll().stream().map(item ->
                PromotionDetailResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .promotionId(item.getPromotion().getId())
                        .build()
        ).toList();
    }

    @Override
    public Integer storePromotion(PromotionRequest req) {
        Promotion promotion = this.promotionRepository.save(Promotion.builder()
                        .name(req.getName())
                        .percent(req.getPercent())
                        .code(req.getCode())
                        .startDate(req.getStartDate())
                        .endDate(req.getEndDate())
                        .note(req.getNote())
                .build());

        for (Long productId : req.getProductIds()) {
            PromotionDetail promotionDetail = PromotionDetail.builder()
                    .promotion(promotion)
                    .product(getProduct(productId))
                    .build();
            this.promotionDetailRepository.save(promotionDetail);
        }
        return promotion.getId();
    }

    @Override
    public Integer storeProductPromotion(PromotionProductReq promotionProductReq) {
        return 0;
    }

    @Override
    public Integer updatePromotion(PromotionRequest req, Integer id) {
        return 0;
    }

    @Override
    public void isDeletePromotion(Integer id) {

    }

    @Override
    public Page<PromotionResponse> searchPromotions(Date startDate, Date endDate, String name, Pageable pageable) {
        return null;
    }

    @Override
    public Page<PromotionResponse> findByKeywordAndDate(String keyword, Date startDate, Date endDate, String status, Pageable pageable) {
        return null;
    }

    private Product getProduct(Long id) {
        return this.productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found!"));
    }

    private User getUser(Long id){
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found!"));
    }
}
