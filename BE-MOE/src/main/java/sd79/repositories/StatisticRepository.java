/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.repositories;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import sd79.dto.response.statistical.StatisticalData;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class StatisticRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public StatisticalData.Statistics getData() {
        return StatisticalData.Statistics.builder()
                .todaySales(getTodaySales())
                .monthsSales(getMonthSales())
                .pendingOrders(getPendingOrders())
                .stockQuantity(getStockQuantity())
                .dataChart(getMonthlyStatistics(2024))
                .products(getTop5ProductsWithSales())
                .build();
    }

    private BigDecimal getTodaySales() {
        TypedQuery<BigDecimal> execute = entityManager.createQuery("SELECT SUM(b.total) FROM Bill b WHERE (b.billStatus.id = 8 OR b.paymentTime IS NOT NULL ) AND FUNCTION('DATE', b.paymentTime) = CURRENT_DATE", BigDecimal.class);
        return execute.getSingleResult();
    }

    private BigDecimal getMonthSales() {
        TypedQuery<BigDecimal> execute = entityManager.createQuery(
                "SELECT SUM(b.total) FROM Bill b " +
                        "WHERE (b.billStatus.id = 8 OR b.paymentTime IS NOT NULL ) AND FUNCTION('MONTH', b.paymentTime) = FUNCTION('MONTH', CURRENT_DATE) " +
                        "AND FUNCTION('YEAR', b.paymentTime) = FUNCTION('YEAR', CURRENT_DATE)",
                BigDecimal.class
        );
        return execute.getSingleResult();
    }

    private Long getPendingOrders() {
        TypedQuery<Long> execute = entityManager.createQuery("SELECT COUNT(b) FROM Bill b WHERE b.billStatus.id = 2 ", Long.class);
        return execute.getSingleResult();
    }

    private Long getStockQuantity() {
        TypedQuery<Long> execute = entityManager.createQuery("SELECT SUM(p.quantity) FROM ProductDetail p WHERE p.status = 'ACTIVE' AND p.product.status = 'ACTIVE'", Long.class);
        return execute.getSingleResult();
    }

    public List<StatisticalData.DataChart> getMonthlyStatistics(int year) {
        String sql = "SELECT " +
                "    m.month, " +
                "    COALESCE(SUM(b.total), 0) AS total_revenue, " +
                "    COALESCE(COUNT(DISTINCT c.id), 0) AS client, " +
                "    COALESCE(COUNT(b.id), 0) AS total_order " +
                "FROM " +
                "    (SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION " +
                "     SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION " +
                "     SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) m " +
                "LEFT JOIN bill b ON MONTH(b.payment_time) = m.month AND YEAR(b.payment_time) = :year " +
                "LEFT JOIN customers c ON MONTH(c.created_at) = m.month AND YEAR(c.created_at) = :year " +
                "GROUP BY m.month " +
                "ORDER BY m.month";

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("year", year);

        @SuppressWarnings("unchecked")
        List<Object[]> results = query.getResultList();

        return results.stream().map(row -> {
            String month = String.format("Tháng %s", row[0]);
            long totalRevenue = ((BigDecimal) row[1]).longValue();
            long client = ((Number) row[2]).longValue();
            long totalOrder = ((Number) row[3]).longValue();

            return new StatisticalData.DataChart(month, totalRevenue, client, totalOrder);
        }).collect(Collectors.toList());
    }

    private List<StatisticalData.TopProduct> getTop5ProductsWithSales() {
        String sql = "SELECT p.name, " +
                "COALESCE(SUM(bd.quantity), 0) AS total_sales, " +
                "COALESCE(pd.quantity, 0) AS stock_quantity, " +
                "GROUP_CONCAT(pi.image_url) AS image_urls, p.id " +
                "FROM products p " +
                "LEFT JOIN product_details pd ON p.id = pd.product_id " +
                "LEFT JOIN bill_detail bd ON pd.id = bd.product_detail_id " +
                "LEFT JOIN product_images pi ON p.id = pi.product_id " +
                "WHERE p.is_deleted = 0 " +
                "GROUP BY p.id, p.name, pd.quantity " +
                "ORDER BY total_sales DESC";

        Query query = entityManager.createNativeQuery(sql);
        query.setMaxResults(5);

        @SuppressWarnings("unchecked")
        List<Object[]> results = query.getResultList();

        return results.stream().map(row -> {
            String productName = (String) row[0];
            BigDecimal totalSales = (BigDecimal) row[1];
            Long stockQuantity = (Long) row[2];
            String imageUrls = (String) row[3];
            Long productId = (Long) row[4];

            List<String> imageUrlList = Arrays.asList(imageUrls.split(","));
            return new StatisticalData.TopProduct(
                    productId,
                    imageUrlList,
                    productName,
                    totalSales,
                    stockQuantity
            );
        }).collect(Collectors.toList());
    }
}