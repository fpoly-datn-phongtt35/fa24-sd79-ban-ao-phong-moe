package sd79.dto.requests.common;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProductParamFilter2 {
    private Integer pageNo = 1;
    private Integer pageSize = 3;
    private String keyword;
    private String category;
    private String brand;
    private String material;
    private String origin;
    private String color;
    private String size;
}
