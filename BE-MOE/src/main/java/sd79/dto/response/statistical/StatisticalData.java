/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.response.statistical;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

public abstract class StatisticalData {

    @Builder
    @Getter
    public static class Statistics {
        private BigDecimal todaySales;

        private BigDecimal monthsSales;

        private Long pendingOrders;

        private Long stockQuantity;

        private List<TopProduct> products;

        private List<DataChart> dataChart;
    }

    @Builder
    @Getter
    @AllArgsConstructor
    public static class DataChart {
        private String month;

        private long total_revenue;

        private long client;

        private long total_order;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class TopProduct{
        private long id;

        private List<String> imageUrl;

        private String name;

        private BigDecimal totalSales;

        private Long stockQuantity;
    }
}
