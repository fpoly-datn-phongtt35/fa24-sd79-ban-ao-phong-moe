package sd79.dto.requests.billRequest;

import lombok.Builder;
import lombok.Getter;
import sd79.enums.PaymentMethod;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Builder
public class BillRequest {
    private Long id;
    private String code;
    private String bankCode;
    private Long customer;
    private Long coupon;
    private Integer billStatus;
    private BigDecimal shipping;
    private BigDecimal subtotal;
    private BigDecimal sellerDiscount;
    private BigDecimal total;
    private PaymentMethod paymentMethod;
    private String message;
    private String note;
    private Date paymentTime;
    private Long userId;
}
