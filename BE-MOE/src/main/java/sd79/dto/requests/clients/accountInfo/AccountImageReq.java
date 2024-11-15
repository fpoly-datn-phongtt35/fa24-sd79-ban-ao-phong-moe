package sd79.dto.requests.clients.accountInfo;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Builder
public class AccountImageReq {
    @NotNull(message = "UserID must be not null")
    private Long UserId;
    private MultipartFile[] images;
}
