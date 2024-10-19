package sd79.dto.requests.productRequests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class MaterialRequest {
    @NotBlank(message = "Vui lòng nhập tên loại chất liệu!")
    private String name;
    @NotNull(message = "User id must be not null!")
    private Long userId;
}
