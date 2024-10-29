package sd79.dto.requests;

import lombok.Builder;
import lombok.Getter;
import sd79.model.BillStatus;
import sd79.model.Coupon;
import sd79.model.Customer;

import java.math.BigDecimal;

@Getter
@Builder
public class BillRequest {
    private String code;
    private Long customer;
    private Long coupon;
    private Integer billStatus;
    private BigDecimal shippingCost;
    private BigDecimal totalAmount;
    private String barcode;
    private String qrCode;
    private Long userId;
}
