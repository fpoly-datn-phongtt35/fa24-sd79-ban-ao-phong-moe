package sd79.dto.requests.productRequests;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ProductDetailStoreRequest {
    @NotNull(message = "productId is null")
    private long productId;
    @NotNull(message = "sizeId is null")
    private int sizeId;
    @NotNull(message = "colorId is null")
    private int colorId;
    @NotNull(message = "quantity is null")
    private int quantity;
    @NotNull(message = "retailPrice is null")
    private BigDecimal retailPrice;
}