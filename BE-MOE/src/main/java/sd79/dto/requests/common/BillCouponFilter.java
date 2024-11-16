package sd79.dto.requests.common;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import sd79.enums.TodoDiscountType;
import sd79.enums.TodoType;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class BillCouponFilter {
        private String keyword;
        private int pageNo = 1;
        private int pageSize = 5;
        private BigDecimal subtotal ;
}
