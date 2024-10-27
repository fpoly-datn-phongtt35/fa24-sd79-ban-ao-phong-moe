package sd79.dto.requests;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class BillDetailRequest {
    private Long productDetail;
    private Long bill;
    private Integer quantity;
    private BigDecimal retailPrice;
    private BigDecimal discountAmount;
    private BigDecimal totalAmountProduct;


}
