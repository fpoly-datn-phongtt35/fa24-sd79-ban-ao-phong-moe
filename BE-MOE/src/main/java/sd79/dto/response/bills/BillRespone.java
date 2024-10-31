package sd79.dto.response.bills;

import lombok.Builder;
import lombok.Getter;
import sd79.model.Coupon;
import sd79.model.Customer;

@Getter
@Builder
public class BillRespone {
    private Long id;
    private String code;
    private Customer customer;
    private Coupon coupon;
}
