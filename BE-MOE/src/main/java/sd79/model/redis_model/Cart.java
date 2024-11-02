/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.model.redis_model;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;
import java.math.BigDecimal;

@RedisHash("cart")
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Cart implements Serializable {
    @Id
    @Indexed
    private String id;

    private String imageUrl;

    private String name;

    private String origin;

    private BigDecimal retailPrice;

    private BigDecimal sellPrice;

    private int quantity;

    @Indexed
    private String username;
}
