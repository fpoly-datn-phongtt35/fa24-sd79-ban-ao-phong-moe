package sd79.dto.requests.common;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import sd79.enums.ProductStatus;
@Getter
@Setter
@Builder
public class BillParamFilter {
    private Integer pageNo = 1;
    private Integer pageSize = 3;
    private String keyword;
    private ProductStatus status = ProductStatus.ALL;
    private String category;
    private String brand;
    private String material;
    private String origin;
    private String color;
    public String size;
}
