/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.response.clients.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class ValidProduct {
    private long id;

    private boolean status;

    private int quantity;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String message;
}
