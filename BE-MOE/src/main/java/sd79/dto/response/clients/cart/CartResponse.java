/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.response.clients.cart;

import lombok.Builder;
import lombok.Getter;
import sd79.dto.response.clients.product.ProductCart;

import java.math.BigDecimal;

@Builder
@Getter
public class CartResponse {

    private String id;

    private String imageUrl;

    private String name;

    private String origin;

    private BigDecimal retailPrice;

    private int quantity;

    private ProductCart productCart;

    private String username;
}
