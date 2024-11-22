package sd79.repositories.customQuery;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import sd79.dto.requests.common.StatisticalParamFilter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class StatisticalCustomizeQuery {

    @PersistenceContext
    private EntityManager entityManager;

    //------------------------------------------ THỐNG KÊ HÓA ĐƠN ------------------------------------------//

    /**
     * Xác định định dạng ngày dựa trên granularity (ngày, tuần, tháng, năm).
     */
    private String resolveDateFormat(String granularity) {
        return switch (granularity.toLowerCase()) {
            case "weekly" -> "YEAR WEEK(b.payment_time)"; // Nhóm theo tuần
            case "monthly" -> "DATE_FORMAT(b.payment_time, '%Y-%m')"; // Nhóm theo tháng
            case "yearly" -> "YEAR(b.payment_time)"; // Nhóm theo năm
            default -> "DATE(b.payment_time)"; // Nhóm theo ngày (mặc định)
        };
    }

    /**
     * Tổng doanh thu trong khoảng thời gian.
     */
    public List<Object[]> getTotalRevenue(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity());
        String sql = String.format(
                "SELECT %s AS period, SUM(b.total) AS totalRevenue " +
                        "FROM bill b " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC", dateFormat
        );

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", filter.getStartDate());
        query.setParameter("endDate", filter.getEndDate());
        return query.getResultList();
    }

    /**
     * Tổng số hóa đơn trong khoảng thời gian.
     */
    public List<Object[]> getTotalBills(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity());
        String sql = String.format(
                "SELECT %s AS period, COUNT(b.id) AS totalBills " +
                        "FROM bill b " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC", dateFormat
        );

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", filter.getStartDate());
        query.setParameter("endDate", filter.getEndDate());
        return query.getResultList();
    }

    /**
     * Tổng phí vận chuyển trong khoảng thời gian.
     */
    public List<Object[]> getTotalShippingCost(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity());
        String sql = String.format(
                "SELECT %s AS period, SUM(b.shipping) AS totalShippingCost " +
                        "FROM bill b " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC", dateFormat
        );

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", filter.getStartDate());
        query.setParameter("endDate", filter.getEndDate());
        return query.getResultList();
    }

    /**
     * Tổng số lượng sản phẩm bán được trong khoảng thời gian.
     */
    public List<Object[]> getTotalProductsSold(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity());
        String sql = String.format(
                "SELECT %s AS period, SUM(bd.quantity) AS totalProductsSold " +
                        "FROM bill_detail bd " +
                        "JOIN bill b ON bd.bill_id = b.id " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC", dateFormat
        );

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", filter.getStartDate());
        query.setParameter("endDate", filter.getEndDate());
        return query.getResultList();
    }

    /**
     * Tổng giá trị giảm giá áp dụng trong khoảng thời gian.
     */
    public List<Object[]> getTotalDiscountAmount(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity());
        String sql = String.format(
                "SELECT %s AS period, SUM(bd.discount_amount) AS totalDiscountAmount " +
                        "FROM bill_detail bd " +
                        "JOIN bill b ON bd.bill_id = b.id " +
                        "WHERE Date(b.payment_time) BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC", dateFormat
        );

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", filter.getStartDate());
        query.setParameter("endDate", filter.getEndDate());
        return query.getResultList();
    }

    /**
     * Tổng số tiền từ sản phẩm (không bao gồm giảm giá) trong khoảng thời gian.
     */
    public List<Object[]> getTotalProductAmount(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity());
        String sql = String.format(
                "SELECT %s AS period, SUM(bd.retail_price * bd.quantity) AS totalProductAmount " +
                        "FROM bill_detail bd " +
                        "JOIN bill b ON bd.bill_id = b.id " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC", dateFormat
        );

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", filter.getStartDate());
        query.setParameter("endDate", filter.getEndDate());
        return query.getResultList();
    }

    /**
     * Tổng hợp các thống kê quan trọng trong khoảng thời gian được chỉ định.
     */
    public Map<String, List<Object[]>> getSummaryStatistics(StatisticalParamFilter filter) {
        Map<String, List<Object[]>> summary = new HashMap<>();
        summary.put("totalRevenue", getTotalRevenue(filter));
        summary.put("totalShippingCost", getTotalShippingCost(filter));
        summary.put("totalBills", getTotalBills(filter));
        summary.put("totalProductsSold", getTotalProductsSold(filter));
        summary.put("totalDiscountAmount", getTotalDiscountAmount(filter));
        summary.put("totalProductAmount", getTotalProductAmount(filter));
        return summary;
    }

    /**
     * Lấy danh sách các sản phẩm bán chạy nhất trong khoảng thời gian được chỉ định.
     */
    public List<Object[]> getTopSellingProducts(StatisticalParamFilter filter, int limit) {
        String dateFormat = resolveDateFormat(filter.getGranularity());
        String sql = String.format(
                "SELECT %s AS period, bd.product_detail_id AS productId, SUM(bd.quantity) AS totalSold " +
                        "FROM bill_detail bd " +
                        "JOIN bill b ON bd.bill_id = b.id " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period, productId " +
                        "ORDER BY totalSold DESC",
                dateFormat
        );

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", filter.getStartDate());
        query.setParameter("endDate", filter.getEndDate());
        query.setMaxResults(limit);
        return query.getResultList();
    }

    /**
     * Lấy doanh thu theo kỳ trong khoảng thời gian được chỉ định.
     */
    public List<Object[]> getRevenueByPeriod(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity());
        String sql = String.format(
                "SELECT %s AS period, SUM(b.total) AS totalRevenue " +
                        "FROM bill b " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC",
                dateFormat
        );

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", filter.getStartDate());
        query.setParameter("endDate", filter.getEndDate());
        return query.getResultList();
    }


    //------------------------------------------ THỐNG KÊ  ------------------------------------------//
}
