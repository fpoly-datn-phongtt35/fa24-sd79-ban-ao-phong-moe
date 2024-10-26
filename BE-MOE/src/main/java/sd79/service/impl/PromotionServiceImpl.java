package sd79.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sd79.dto.requests.PromotionRequest;
import sd79.dto.response.PromotionResponse;
import sd79.exception.EntityNotFoundException;
import sd79.model.Promotion;
import sd79.model.User;
import sd79.repositories.PromotionRepo;
import sd79.repositories.auth.UserRepository;
import sd79.service.PromotionService;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor

public class PromotionServiceImpl implements PromotionService {
    private final PromotionRepo promotionRepo;
    private final UserRepository userRepository;

    @Override
    public List<PromotionResponse> getAllPromotion() { //tra ra danh dach phieu giam gia
        return promotionRepo.findAll().stream().map(this::convertCPromotionResponse).toList().reversed();
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

    @Transactional
    @Override
    public Page<PromotionResponse> searchPromotions(Date startDate, Date endDate, String name, Pageable pageable) {
        Page<Promotion> promotions = promotionRepo.searchPromotions(startDate, endDate, name, pageable);
        return promotions.map(this::convertCPromotionResponse);  // Convert entity to response DTO
    }

    @Override
    public Page<PromotionResponse> findByKeywordAndDate(String keyword, Date startDate, Date endDate,
                                                     String status, Pageable pageable) {
        Page<Promotion> promotions;

        // Kiểm tra nếu không có điều kiện tìm kiếm, trả về toàn bộ danh sách
        if ((keyword == null || keyword.isEmpty()) && startDate == null && endDate == null &&
                 (status == null || status.isEmpty())) {
            promotions = promotionRepo.findAll(pageable);  // Lấy toàn bộ danh sách với phân trang
        } else {
            // Nếu có điều kiện tìm kiếm, gọi hàm findByKeywordAndDate
            promotions = promotionRepo.findByKeywordAndDate(keyword, startDate, endDate, status, pageable);
        }

        // Chuyển đổi từ entity Coupon sang DTO CouponResponse
        return promotions.map(this::convertCPromotionResponse);
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
        promotion.setStartDate(promotionRequest.getStartDate());
        promotion.setEndDate(promotionRequest.getEndDate());
        promotion.setDescription(promotionRequest.getDescription());
    }

    private PromotionResponse convertCPromotionResponse(Promotion promotion) {//lay du lieu phieu giam gia respone de hien thi danh sach
        return PromotionResponse.builder()
                .id(promotion.getId())
                .name(promotion.getName())
                .promotionValue(promotion.getPromotionValue())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .description(promotion.getDescription())
                .build();
    }

    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

}
