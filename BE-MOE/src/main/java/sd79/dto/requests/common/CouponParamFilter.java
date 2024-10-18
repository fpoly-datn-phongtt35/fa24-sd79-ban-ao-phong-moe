package sd79.dto.requests.common;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import sd79.enums.TodoDiscountType;
import sd79.enums.TodoType;

@Getter
@Setter
public class CouponParamFilter {
    private String keyword;
    private String startDate;
    private String endDate;
    private TodoDiscountType discountType = TodoDiscountType.ALL;
    private TodoType type = TodoType.ALL;
    private String status ;
    private int pageNo = 1;
    private int pageSize = 5;
    private String sort = "id";
    private String direction = "ASC";


}
