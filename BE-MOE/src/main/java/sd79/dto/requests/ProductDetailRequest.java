package sd79.dto.requests;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ProductDetailRequest {
    private BigDecimal retailPrice;
    private int sizeId;
    private int colorId;
    private int quantity;
}
