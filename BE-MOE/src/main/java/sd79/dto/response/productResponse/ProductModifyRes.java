/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.response.productResponse;

import lombok.Builder;
import lombok.Getter;

import java.util.Date;
import java.util.List;

@Getter
@Builder
public class ProductModifyRes {
    private String name;

    private String origin;

    private List<ImageResponse> imageUrl;

    private BrandResponse brand;

    private CategoryResponse category;

    private MaterialResponse material;

    private String description;

    private String created_by;

    private String modified_by;

    private Date created_at;

    private Date modified_at;

    private List<ProductDetailResponse> details;
}
