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
