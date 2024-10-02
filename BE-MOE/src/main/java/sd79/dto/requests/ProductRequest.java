package sd79.dto.requests;

import lombok.Builder;
import lombok.Getter;
import sd79.enums.ProductStatus;

import java.util.Set;

@Getter
@Builder
public class ProductRequest {
    //Product
    private String name;
    private String description;
    private ProductStatus status;
    private int categoryId;
    private int brandId;
    private int materialId;
    private String origin;
    private String[] imageUrl;
    //Product detail
    private Set<ProductDetailRequest> productDetails;
    //Created by
    private long userId;
}
