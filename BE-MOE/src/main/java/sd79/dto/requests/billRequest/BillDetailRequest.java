package sd79.dto.requests.billRequest;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BillDetailRequest {
    private Long productDetail;
    private Long bill;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal discountAmount;
    private BigDecimal totalAmountProduct;


}
