package sd79.dto.requests.productRequests;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ProductDetailRequest {
    private int sizeId;
    private int colorId;
    private int quantity;
    private BigDecimal retailPrice;
}
