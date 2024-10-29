/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.response.clients.product;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ProductClientResponse {
    private Long productId;

    private String imageUrl;

    private String name;

    private BigDecimal retailPrice;

    private BigDecimal discountPrice;

    private float rate;

    private long rateCount;

    public ProductClientResponse(Long productId, String imageUrl, String name, BigDecimal retailPrice, BigDecimal discountPrice, float rate, long rateCount) {
        this.productId = productId;
        this.imageUrl = imageUrl;
        this.name = name;
        this.retailPrice = retailPrice;
        this.discountPrice = discountPrice;
        this.rate = rate;
        this.rateCount = rateCount;
    }
}
