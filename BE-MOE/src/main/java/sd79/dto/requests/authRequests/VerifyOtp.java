/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.requests.authRequests;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VerifyOtp {

    private String otp;

    private String token;
}
