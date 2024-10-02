package sd79.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sd79.dto.requests.CouponRequest;
import sd79.dto.response.CouponResponse;
import sd79.model.Coupon;

import java.util.Date;
import java.util.List;

public interface CouponService {
    List<CouponResponse> getCoupon();
    CouponResponse getCouponById(Long id);
    long createCoupon(CouponRequest couponRequest);
    long updateCoupon(Long id, CouponRequest couponRequest);
    void deleteCoupon(Long id);
    Page<CouponResponse> searchCoupons(Date startDate, Date endDate, String name, String code, Pageable pageable);
    List<Coupon> findByKeywordAndDate(String keyword,Date startDate, Date endDate);
}
