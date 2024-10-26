package sd79.service;

import sd79.dto.requests.CouponImageReq;
import sd79.dto.requests.CouponRequest;
import sd79.dto.requests.CouponShareReq;
import sd79.dto.requests.common.CouponParamFilter;
import sd79.dto.response.CouponResponse;
import sd79.dto.response.CustomerResponse;
import sd79.dto.response.PageableResponse;
import sd79.model.Coupon;
import sd79.model.Customer;

public interface CouponService {
    PageableResponse getAllCoupon(CouponParamFilter param);
    CouponResponse getCouponById(Long id);
    long storeCoupon(CouponRequest couponRequest);
    void storeCouponImages(CouponImageReq req);
    long updateCoupon(Long id, CouponRequest couponRequest);
    void deleteCoupon(Long id);
    void deleteCouponImage(Long couponId);
    void sendCouponEmail(Coupon coupon, Customer customer);
    Coupon findCouponById(Long id);
    Customer findCustomerById(Long id);
}
