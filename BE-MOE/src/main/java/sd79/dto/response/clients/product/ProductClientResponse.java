/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.response.clients.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.Date;

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

    private Integer percent;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date expiredDate;

    public ProductClientResponse(Long productId, String imageUrl, String name, BigDecimal retailPrice, BigDecimal discountPrice, float rate, long rateCount, Integer percent, Date expiredDate) {
        this.productId = productId;
        this.imageUrl = imageUrl;
        this.name = name;
        this.retailPrice = retailPrice;
        this.discountPrice = discountPrice;
        this.rate = rate;
        this.rateCount = rateCount;
        this.percent = percent;
        this.expiredDate = expiredDate;
    }
}
