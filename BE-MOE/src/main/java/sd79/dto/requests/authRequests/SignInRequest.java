/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.requests.authRequests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import sd79.enums.Platform;

@Data
public class SignInRequest {
    @NotBlank(message = "Username must be not null")
    private String username;
    @NotBlank(message = "Password must be not blank")
    private String password;

    //No require
    @NotNull(message = "Platform must be not null")
    private Platform platform;
    private String deviceToken;
    private String version;
}