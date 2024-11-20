package sd79.dto.requests.employees;

import lombok.Data;

@Data
public class PasswordUpdateRequest {
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}

