/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.requests.common;

import lombok.Getter;
import lombok.Setter;
import sd79.enums.ProductStatus;

@Getter
@Setter
public class ProductParamFilter {
    private Integer pageNo = 1;
    private Integer pageSize = 3;
    private String keyword;
    private ProductStatus status = ProductStatus.ALL;
    private String category;
    private String brand;
    private String material;
    private String origin;
}
