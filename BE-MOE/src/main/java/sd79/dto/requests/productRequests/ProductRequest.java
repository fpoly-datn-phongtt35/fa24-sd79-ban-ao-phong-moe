/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.requests.productRequests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import sd79.enums.ProductStatus;

import java.util.Set;

@Getter
@Builder
public class ProductRequest {
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

    @NotNull(message = "Chưa có thuộc tính sản phẩm!")
    private Set<ProductDetailRequest> productDetails;

    @NotNull(message = "User is null!")
    private Long userId;
}
