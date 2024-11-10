/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.requests.productRequests;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public abstract class ProductRequests {

    @Getter
    @Setter
    @Builder
    public static class ParamFilters {
        private Integer pageNo = 1;

        private Integer pageSize = 5;

        private String keyword;

        private List<Integer> categoryIds;

        private List<Integer> brandIds;

        private List<Integer> materialIds;

        private BigDecimal minPrice;

        private BigDecimal maxPrice;

        private SortBy sortBy;
    }

    public enum SortBy{
        PRICE_ASC,
        PRICE_DESC,
        CREATED_AT,
        DEFAULT
    }
}
