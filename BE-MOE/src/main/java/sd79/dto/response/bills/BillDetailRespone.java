package sd79.dto.response.bills;

import lombok.Builder;
import lombok.Getter;
import sd79.dto.response.productResponse.ProductDetailResponse2;
import sd79.model.Bill;
import sd79.model.ProductDetail;

import java.math.BigDecimal;

@Getter
@Builder
public class BillDetailRespone {
    private Long id;
    private ProductDetailResponse2 productDetail;
    private Integer quantity;
    private BigDecimal retailPrice;
    private BigDecimal discountAmount;

}
