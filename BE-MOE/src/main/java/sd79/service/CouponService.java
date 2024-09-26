package sd79.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sd79.dto.requests.CouponRequest;
import sd79.dto.response.CouponResponse;

import java.util.Date;
import java.util.List;

public interface CouponService {
    List<CouponResponse> getCoupon();
    CouponResponse getCouponById(Long id);
    void createCoupon(CouponRequest couponRequest);
    void updateCoupon(Long id, CouponRequest couponRequest);
    void deleteCoupon(Long id);
    Page<CouponResponse> searchCoupons(Date startDate, Date endDate, String name, String code, Pageable pageable);
}
