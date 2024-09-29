package sd79.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class CategoryRequest {
    @NotBlank(message = "Vui lòng nhập tên danh mục!")
    private String name;
    @NotNull(message = "User id must be not null!")
    private Long userId;
}
