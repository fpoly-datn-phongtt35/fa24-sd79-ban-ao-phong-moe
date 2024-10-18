package sd79.dto.requests;

import lombok.Getter;
import lombok.Setter;
import sd79.model.Coupon;
import sd79.model.Customer;

@Getter
@Setter
public class CouponShareReq {
    private Long id;
    private Coupon coupon;
    private Customer customer;
    private Boolean isDeleted;
}
