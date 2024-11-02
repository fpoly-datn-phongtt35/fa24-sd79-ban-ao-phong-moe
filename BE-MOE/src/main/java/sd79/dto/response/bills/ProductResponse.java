package sd79.dto.response.bills;

import lombok.Builder;
import lombok.Getter;
import sd79.dto.response.productResponse.ProductDetailResponse;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class ProductResponse {
    private Long id; // id product detail

    private String productName;

    private List<String> imageUrl;

    private String brand;

    private String category;

    private String material;

    private String color;

    private String size;

    private String origin;

    private BigDecimal price;

    private int quantity;

}
