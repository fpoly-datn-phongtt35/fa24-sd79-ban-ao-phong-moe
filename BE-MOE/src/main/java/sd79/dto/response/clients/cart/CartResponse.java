/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.response.clients.cart;

import lombok.Builder;
import lombok.Getter;
import sd79.dto.response.clients.product.ValidProduct;

import java.math.BigDecimal;

@Builder
@Getter
public class CartResponse {

    private String id;

    private String imageUrl;

    private String name;

    private String origin;

    private BigDecimal retailPrice;

    private BigDecimal sellPrice;

    private int quantity;

    private ValidProduct validProduct;

    private String username;
}
