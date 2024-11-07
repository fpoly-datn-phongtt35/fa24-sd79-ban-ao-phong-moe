/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.response.clients.customer;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class UserInfoRes {
    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String address;
}
