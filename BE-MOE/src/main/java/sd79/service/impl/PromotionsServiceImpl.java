package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sd79.dto.requests.PromotionDetailRequest;
import sd79.dto.requests.PromotionRequest;
import sd79.dto.response.PromotionDetailResponse;
import sd79.dto.response.PromotionResponse;
import sd79.exception.EntityNotFoundException;
import sd79.model.*;
import sd79.repositories.auth.UserRepository;
import sd79.repositories.products.ProductRepository;
import sd79.repositories.promotions.PromotionDetailRepository;
import sd79.repositories.promotions.PromotionRepository;
import sd79.service.PromotionService;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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
                        .build()
        ).toList();
    }

    @Override
    public PromotionResponse getPromotionId(Integer id) {
        Promotion promotion = this.promotionRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Promotion not found"));
        return convertPromotionResponsse(promotion);
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
            sd79.model.PromotionDetail promotionDetail = sd79.model.PromotionDetail.builder()
                    .promotion(promotion)
                    .product(getProduct(productId))
                    .build();
            this.promotionDetailRepository.save(promotionDetail);
        }
        return promotion.getId();
    }


    @Override
    public Integer updatePromotion(PromotionRequest req, Integer id) {
        Promotion promotion = this.promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id " + id));

        // Cập nhật thông tin khuyến mãi
        promotion.setName(req.getName());
        promotion.setPercent(req.getPercent());
        promotion.setCode(req.getCode());
        promotion.setStartDate(req.getStartDate());
        promotion.setEndDate(req.getEndDate());
        promotion.setNote(req.getNote());
        populatePromotionData(promotion, req);

        // Lưu lại thông tin đã cập nhật
        this.promotionRepository.save(promotion);


        // Thêm mới các chi tiết khuyến mãi dựa trên danh sách productIds từ request
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
    public void deleteByPromotionId(Integer id) {
        Promotion promotion = this.promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id " + id));

        promotionDetailRepository.deleteByPromotionId(id);

        promotionRepository.delete(promotion);

    }

    private void populatePromotionData(Promotion promotion, PromotionRequest promotionRequest) {//lay du lieu phieu giam gia request de them
        promotion.setName(promotionRequest.getName());
        promotion.setCode(promotionRequest.getCode());
        promotion.setPercent(promotionRequest.getPercent());
        promotion.setStartDate(promotionRequest.getStartDate());
        promotion.setEndDate(promotionRequest.getEndDate());
        promotion.setNote(promotionRequest.getNote());
//        promotion.setPromotionDetails(promotionRequest.getProductIds());
    }

    private PromotionResponse convertPromotionResponsse(Promotion promotion){
        List<Product> products = promotion.getPromotionDetails().stream()
                .map(PromotionDetail::getProduct)
                .collect(Collectors.toList());
        List<Long> list = new ArrayList<>();

        products.forEach(i -> {
            list.add(i.getId());
        });
        return PromotionResponse.builder()
                .id(promotion.getId())
                .name(promotion.getName())
                .code(promotion.getCode())
                .percent(promotion.getPercent())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .note(promotion.getNote())
                .listIdProduct(list)
                .build();
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
