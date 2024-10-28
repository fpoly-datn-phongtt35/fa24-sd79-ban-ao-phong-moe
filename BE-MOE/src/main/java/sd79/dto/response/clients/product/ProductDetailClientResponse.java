package sd79.dto.response.clients.product;

import lombok.Builder;
import lombok.Getter;
import sd79.dto.response.productResponse.ColorResponse;
import sd79.dto.response.productResponse.SizeResponse;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;

@Getter
@Builder
public class ProductDetailClientResponse {
    private Long productId;

    private List<String> imageUrl;

    private String name;

    private BigDecimal retailPrice;

    private BigDecimal discountPrice;

    private float rate;

    private long rateCount;

    private HashSet<SizeResponse> sizes;

    private HashSet<ColorResponse> colors;

    private long quantity;

    private String origin;

    private String category;

    private String material;

    private String brand;

    private String description;

    private List<ProductClientResponse> relatedItem;
}
