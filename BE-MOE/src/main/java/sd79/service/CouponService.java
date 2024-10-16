package sd79.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import sd79.dto.requests.CouponImageReq;
import sd79.dto.requests.CouponRequest;
import sd79.dto.response.CouponResponse;
import sd79.dto.response.PageableResponse;
import sd79.enums.TodoDiscountType;
import sd79.enums.TodoType;
import sd79.model.Coupon;

import java.util.Date;
import java.util.List;

public interface CouponService {
    PageableResponse getAllCoupon(Integer pageNo, Integer pageSize, String keyword, TodoType type, TodoDiscountType discountType, String startDate, String endDate, String status, String sort, String direction);
    CouponResponse getCouponById(Long id);
    long storeCoupon(CouponRequest couponRequest);
    void storeCouponImages(CouponImageReq req);
    long updateCoupon(Long id, CouponRequest couponRequest);
    void deleteCoupon(Long id);
    void deleteCouponImage(Long couponId);
}
