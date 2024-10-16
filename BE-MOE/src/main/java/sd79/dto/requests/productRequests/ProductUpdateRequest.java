package sd79.dto.requests.productRequests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import sd79.enums.ProductStatus;

@Getter
@Builder
public class ProductUpdateRequest {
    @NotBlank(message = "Vui lòng nhập tên sản phẩm")
    private String name;

    private String description;

    private ProductStatus status;

    @NotNull(message = "Vui lòng nhập danh mục sản phẩm")
    private Integer categoryId;

    @NotNull(message = "Vui lòng nhập thương hiệu sản phẩm")
    private Integer brandId;

    @NotNull(message = "Vui lòng nhập chất liệu sản phẩm")
    private Integer materialId;

    @NotBlank(message = "Vui lòng nhập nơi xuất xứ")
    private String origin;

    @NotNull(message = "User is null!")
    private Long userId;
}
