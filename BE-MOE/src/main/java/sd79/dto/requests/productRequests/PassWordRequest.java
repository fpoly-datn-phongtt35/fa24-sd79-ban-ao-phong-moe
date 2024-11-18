package sd79.dto.requests.productRequests;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PassWordRequest {

    private String currentPassword;
    private String newPassword;
}
