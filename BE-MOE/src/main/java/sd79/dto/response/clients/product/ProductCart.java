/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.response.clients.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class ProductCart {
    private long id;

    private boolean status;

    private int quantity;

    private BigDecimal sellPrice;

    private Integer percent;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String message;
}
