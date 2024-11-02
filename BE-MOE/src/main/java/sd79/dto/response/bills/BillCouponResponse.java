package sd79.dto.response.bills;

import lombok.Builder;
import lombok.Getter;
import sd79.enums.TodoDiscountType;
import sd79.enums.TodoType;

import java.math.BigDecimal;

@Getter
@Builder
public class BillCouponResponse {
    private long id;
    private String code;
    private String name;
    private BigDecimal discountValue;
    private TodoDiscountType discountType;
    private BigDecimal conditions;
    private BigDecimal maxValue;
}
