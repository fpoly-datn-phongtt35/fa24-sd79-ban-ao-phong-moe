/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.requests.employees;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Builder
public class EmployeeImageReq {
    @NotNull(message = "productId must be not null")
    private Integer productId;
    private MultipartFile[] images;
}
