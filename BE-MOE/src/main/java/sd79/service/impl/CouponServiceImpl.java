package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.CouponRequest;
import sd79.dto.response.CouponResponse;
import sd79.enums.TodoDiscountType;
import sd79.enums.TodoType;
import sd79.exception.EntityNotFoundException;
import sd79.model.Coupon;
import sd79.model.User;
import sd79.repositories.CouponRepo;
import sd79.repositories.auth.UserRepository;
import sd79.service.CouponService;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepo couponRepo;
    private final UserRepository userRepository;

    @Override
    public List<CouponResponse> getCoupon() { //tra ra danh dach phieu giam gia
        return couponRepo.findAll().stream().map(this::convertCouponResponse).toList();
    }

    @Override
    public CouponResponse getCouponById(Long id) { // tim kiem id phieu giam gia
        Coupon coupon = couponRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        return convertCouponResponse(coupon);
    }

    @Transactional
    @Override
    public long createCoupon(CouponRequest couponRequest) { //tao phieu giam gia
        Coupon coupon = Coupon.builder()
                .code(couponRequest.getCode())
                .name(couponRequest.getName())
                .discountValue(couponRequest.getDiscountValue())
                .discountType(couponRequest.getDiscountType())
                .maxValue(couponRequest.getMaxValue())
                .quantity(couponRequest.getQuantity())
                .conditions(couponRequest.getConditions())
                .type(couponRequest.getType())
                .startDate(couponRequest.getStartDate())
                .endDate(couponRequest.getEndDate())
                .description(couponRequest.getDescription())
                .image(couponRequest.getImage())
                .build();
        coupon.setCreatedBy(getUserById(couponRequest.getUserId()));
        coupon.setUpdatedBy(getUserById(couponRequest.getUserId()));
        return couponRepo.save(coupon).getId();
    }

    @Transactional
    @Override
    public long updateCoupon(Long id, CouponRequest couponRequest) { // sua phieu giam gia
        Coupon coupon = couponRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        coupon.setCode(couponRequest.getCode());
        coupon.setName(couponRequest.getName());
        coupon.setDiscountValue(couponRequest.getDiscountValue());
        coupon.setDiscountType(couponRequest.getDiscountType());
        coupon.setMaxValue(couponRequest.getMaxValue());
        coupon.setQuantity(couponRequest.getQuantity());
        coupon.setConditions(couponRequest.getConditions());
        coupon.setType(couponRequest.getType());
        coupon.setStartDate(couponRequest.getStartDate());
        coupon.setEndDate(couponRequest.getEndDate());
        coupon.setDescription(couponRequest.getDescription());
        coupon.setImage(couponRequest.getImage());
        coupon.setCreatedBy(getUserById(couponRequest.getUserId()));
        coupon.setUpdatedBy(getUserById(couponRequest.getUserId()));
        return couponRepo.save(coupon).getId();
    }


    @Transactional
    @Override
    public void deleteCoupon(Long id) {//xoa phieu giam gia
        Coupon coupon = couponRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        couponRepo.delete(coupon);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<CouponResponse> searchCoupons(Date startDate, Date endDate, String name, String code, Pageable pageable) {
        Page<Coupon> coupons = couponRepo.searchCoupons(startDate, endDate, name, code, pageable);
        return coupons.map(this::convertCouponResponse);  // Convert entity to response DTO
    }

    @Override
    public Page<CouponResponse> findByKeywordAndDate(String keyword, Date startDate, Date endDate,
                                          TodoDiscountType discountType, TodoType type,
                                          String status, Pageable pageable) {
        Page<Coupon> coupons;

        // Kiểm tra nếu không có điều kiện tìm kiếm, trả về toàn bộ danh sách
        if ((keyword == null || keyword.isEmpty()) && startDate == null && endDate == null &&
                discountType == null && type == null && (status == null || status.isEmpty())) {
            coupons = couponRepo.findAll(pageable);  // Lấy toàn bộ danh sách với phân trang
        } else {
            // Nếu có điều kiện tìm kiếm, gọi hàm findByKeywordAndDate
            coupons = couponRepo.findByKeywordAndDate(keyword, startDate, endDate, discountType, type, status, pageable);
        }

        // Chuyển đổi từ entity Coupon sang DTO CouponResponse
        return coupons.map(this::convertCouponResponse);
    }



    private CouponResponse convertCouponResponse(Coupon coupon) {//lay du lieu phieu giam gia respone de hien thi danh sach
        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .type(coupon.getType())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .maxValue(coupon.getMaxValue())
                .quantity(coupon.getQuantity())
                .conditions(coupon.getConditions())
                .startDate(coupon.getStartDate())
                .endDate(coupon.getEndDate())
                .status(coupon.getStatus())
                .description(coupon.getDescription())
                .image(coupon.getImage())
                .build();
    }

    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
}
