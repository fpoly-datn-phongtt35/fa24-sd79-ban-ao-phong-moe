package sd79.dto.response.bills;

import lombok.Builder;
import lombok.Getter;
import sd79.enums.PaymentMethod;
import sd79.model.Coupon;
import sd79.model.Customer;
import sd79.model.Employee;
import sd79.model.User;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Builder
public class BillEditResponse {
    private Long id;
    private String code;
    private Customer customer;
    private BillCouponResponse coupon;
    private Integer status;
    private BigDecimal shipping;
    private BigDecimal subtotal;
    private BigDecimal sellerDiscount;
    private BigDecimal total;
    private PaymentMethod paymentMethod;
    private String message;
    private String note;
    private Date paymentTime;
    private Employee employee;
    private List<BillDetailResponse> billDetails;
    private Date createAt;
}
