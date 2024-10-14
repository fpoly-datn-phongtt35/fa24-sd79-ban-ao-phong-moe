package sd79.dto.response.productResponse;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ProductDetailResponse {
    private long id;

    private String color;

    private String size;

    private int quantity;

    private BigDecimal price;
}
