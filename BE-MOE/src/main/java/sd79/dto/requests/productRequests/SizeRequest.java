/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.requests.productRequests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SizeRequest {
    @NotBlank(message = "Vui lòng nhập tên cho size!")
    private String name;

    @NotNull(message = "Vui lòng chiều dài!")
    @Min(value = 0, message = "Min chiều dài phải lớn hơn 0")
    private float length;

    @NotNull(message = "Vui lòng nhập chiều rộng!")
    @Min(value = 0, message = "Min cân nặng phải lớn hơn 0")
    private float width;

    @NotNull(message = "Vui lòng nhập chiều dài của tay áo!")
    @Min(value = 0, message = "Min tay áo phải lớn hơn 0")
    private float sleeve;

    @NotNull(message = "User id must be not null!")
    private Long userId;
}
