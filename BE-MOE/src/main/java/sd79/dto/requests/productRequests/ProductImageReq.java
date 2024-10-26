package sd79.dto.requests.productRequests;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Builder
public class ProductImageReq {
    @NotNull(message = "productId must be not null")
    private Long productId;
    private MultipartFile[] images;
}
