package sd79.dto.requests.productRequests;

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
    private Integer categoryId;
    private Integer brandId;
    private Integer materialId;
    private String origin;
    //Product detail
    private Set<ProductDetailRequest> productDetails;
    //Created/Updated by
    private Long userId;
}
