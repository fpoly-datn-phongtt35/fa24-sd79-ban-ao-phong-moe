package sd79.dto.requests.productRequests;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ProductDetailModify {
    private long id;
    private int quantity;
    private BigDecimal price;
}
