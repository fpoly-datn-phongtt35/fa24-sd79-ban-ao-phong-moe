package sd79.dto.requests;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class BillRequest {
    private Long id;
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
