/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
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
