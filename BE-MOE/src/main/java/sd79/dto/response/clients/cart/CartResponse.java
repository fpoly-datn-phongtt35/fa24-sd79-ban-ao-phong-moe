/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.response.clients.cart;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.math.BigDecimal;

public abstract class CartResponse {

    @Builder
    @Getter
    public static class Cart {

        private String id;

        private String imageUrl;

        private String name;

        private String origin;

        private BigDecimal retailPrice;

        private int quantity;

        private ProductCart productCart;

        private String username;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Setter
    public static class ProductCart {
        private long id;

        private boolean status;

        private int quantity;

        private BigDecimal sellPrice;

        private Integer percent;

        @JsonInclude(JsonInclude.Include.NON_NULL)
        private String message;
    }
}
