package sd79.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.dto.requests.PromotionRequest;
import sd79.dto.response.PromotionResponse;
import sd79.model.Promotion;
import sd79.repositories.PromotionRepo;
import sd79.service.PromotionService;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor

public class PromotionServiceImpl implements PromotionService {
    private final PromotionRepo promotionRepo;

    @Override
    public List<PromotionResponse> getAllPromotion() { //tra ra danh dach phieu giam gia
        return promotionRepo.findAll().stream().map(this::convertCPromotionResponse).toList();
    }

    @Override
    public PromotionResponse getPromotionId(Integer id) { // tim kiem id phieu giam gia
        Promotion promotion = promotionRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        return convertCPromotionResponse(promotion);
    }

    @Transactional
    @Override
    public Integer storePromotion(PromotionRequest promotionRequest) { //tao phieu giam gia
        Promotion promotion = new Promotion();
        populatePromotionData(promotion, promotionRequest);
        return promotionRepo.save(promotion).getId();
    }

    @Transactional
    @Override
    public Integer updatePromotion(PromotionRequest promotionRequest, Integer id) {//sua phieu giam gia
        Promotion promotion = promotionRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        populatePromotionData(promotion, promotionRequest);
        return promotionRepo.save(promotion).getId();
    }

    @Transactional
    @Override
    public void isDeletePromotion(Integer id) {//xoa phieu giam gia
        Promotion promotion = promotionRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        promotionRepo.delete(promotion);
    }

//    public Promotion updatePromotion(Promotion promotion, Integer id) {
//        Optional<Promotion> optional = this.promotionRepo.findById(id);
//        return optional.map(o -> {
//            o.setId(promotion.getId());
//            o.setName(promotion.getName());
//            o.setPromotionType(promotion.getPromotionType());
//            o.setPromotionValue(promotion.getPromotionValue());
//            o.setStartDate(promotion.getStartDate());
//            o.setEndDate(promotion.getEndDate());
//            o.setDescription(promotion.getDescription());
//            return this.promotionRepo.save(o);
//        }).orElse(null);
//    }

    private void populatePromotionData(Promotion promotion, PromotionRequest promotionRequest) {//lay du lieu phieu giam gia request de them
        promotion.setName(promotionRequest.getName());
        promotion.setPromotionValue(promotionRequest.getPromotionValue());
        promotion.setPromotionType(promotionRequest.getPromotionType());
        promotion.setStartDate(promotionRequest.getStartDate());
        promotion.setEndDate(promotionRequest.getEndDate());
        promotion.setDescription(promotionRequest.getDescription());
    }

    private PromotionResponse convertCPromotionResponse(Promotion promotion) {//lay du lieu phieu giam gia respone de hien thi danh sach
        return PromotionResponse.builder()
                .id(promotion.getId())
                .name(promotion.getName())
                .promotionValue(promotion.getPromotionValue())
                .promotionType(promotion.getPromotionType())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .description(promotion.getDescription())
                .build();
    }

}
