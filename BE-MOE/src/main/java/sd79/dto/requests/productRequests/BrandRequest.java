/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.requests.productRequests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class BrandRequest {
    @NotBlank(message = "Vui lòng nhập tên thương hiệu!")
    private String name;
    @NotNull(message = "User id must be not null!")
    private Long userId;
}
