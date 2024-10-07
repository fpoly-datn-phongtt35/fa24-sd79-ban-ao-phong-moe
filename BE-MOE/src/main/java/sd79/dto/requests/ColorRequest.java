package sd79.dto.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ColorRequest {
    @NotBlank(message = "Vui lòng nhập tên cho size!")
    private String name;

    @NotBlank(message = "Vui lòng nhập mã hex!")
    private String hex_code;

    @NotNull(message = "User id must be not null!")
    private Long userId;
}
