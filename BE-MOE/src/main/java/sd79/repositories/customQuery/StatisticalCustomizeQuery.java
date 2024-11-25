package sd79.repositories.customQuery;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import sd79.dto.requests.common.StatisticalParamFilter;

import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class StatisticalCustomizeQuery {

    @PersistenceContext
    private EntityManager entityManager;

    //------------------------------------------ THỐNG KÊ HÓA ĐƠN ------------------------------------------//
    /** Hàm điều chỉnh ngày bắt đầu (00:00:00) và ngày kết thúc (23:59:59) */
    private Date adjustDateStart(Date startDate) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(startDate);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    /** Hàm điều chỉnh ngày bắt đầu (00:00:00) và ngày kết thúc (23:59:59) */
    private Date adjustDateEnd(Date endDate) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(endDate);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        cal.set(Calendar.MILLISECOND, 999);
        return cal.getTime();
    }

    /**
     * Xác định định dạng ngày dựa trên granularity (ngày, tuần, tháng, năm).
     */
    private String resolveDateFormat(String granularity, String columnName) {
        if (granularity == null || columnName == null || columnName.isBlank()) {
            throw new IllegalArgumentException("Granularity and column name must not be null or blank");
        }

        return switch (granularity.toLowerCase()) {
            case "weekly" -> String.format("CONCAT(YEAR(%s), '-T', LPAD(WEEK(%s, 1), 2, '0'))", columnName, columnName);
            case "monthly" -> String.format("DATE_FORMAT(%s, '%%Y-%%m')", columnName);
            case "yearly" -> String.format("YEAR(%s)", columnName);
            default -> String.format("DATE(%s)", columnName);
        };
    }

    /**
     * Creates and executes a query with common parameters and pagination.
     */
    private List<Object[]> executeQuery(String sql, StatisticalParamFilter filter) {
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", adjustDateStart(filter.getStartDate()));
        query.setParameter("endDate", adjustDateEnd(filter.getEndDate()));

        if (filter.getPageNo() != null && filter.getPageSize() != null) {
            int firstResult = (filter.getPageNo() - 1) * filter.getPageSize();
            query.setFirstResult(firstResult);
            query.setMaxResults(filter.getPageSize());
        }

        return query.getResultList();
    }

    /**
     * Tổng doanh thu trong khoảng thời gian.
     */
    public List<Object[]> getTotalRevenue(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity(), "b.payment_time");
        String sql = String.format(
                "SELECT %s AS period, SUM(b.total) AS totalRevenue " +
                        "FROM bill b " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC",
                dateFormat
        );
        return executeQuery(sql, filter);
    }

    /**
     * Tổng số hóa đơn trong khoảng thời gian.
     */
    public List<Object[]> getTotalBills(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity(), "b.payment_time");
        String sql = String.format(
                "SELECT %s AS period, COUNT(b.id) AS totalBills " +
                        "FROM bill b " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC",
                dateFormat
        );
        return executeQuery(sql, filter);
    }

    /**
     * Tổng phí vận chuyển trong khoảng thời gian.
     */
    public List<Object[]> getTotalShippingCost(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity(), "b.payment_time");
        String sql = String.format(
                "SELECT %s AS period, SUM(b.shipping) AS totalShippingCost " +
                        "FROM bill b " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC",
                dateFormat
        );
        return executeQuery(sql, filter);
    }

    /**
     * Tổng số lượng sản phẩm bán được trong khoảng thời gian.
     */
    public List<Object[]> getTotalProductsSold(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity(), "b.payment_time");
        String sql = String.format(
                "SELECT %s AS period, SUM(bd.quantity) AS totalProductsSold " +
                        "FROM bill_detail bd " +
                        "JOIN bill b ON bd.bill_id = b.id " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC",
                dateFormat
        );
        return executeQuery(sql, filter);
    }

    /**
     * Tổng giá trị giảm giá áp dụng trong khoảng thời gian.
     */
    public List<Object[]> getTotalDiscountAmount(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity(), "b.payment_time");
        String sql = String.format(
                "SELECT %s AS period, SUM(bd.discount_amount) AS totalDiscountAmount " +
                        "FROM bill_detail bd " +
                        "JOIN bill b ON bd.bill_id = b.id " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC",
                dateFormat
        );
        return executeQuery(sql, filter);
    }

    /**
     * Tổng số tiền từ sản phẩm (không bao gồm giảm giá) trong khoảng thời gian.
     */
    public List<Object[]> getTotalProductAmount(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity(), "b.payment_time");
        String sql = String.format(
                "SELECT %s AS period, SUM(bd.retail_price * bd.quantity) AS totalProductAmount " +
                        "FROM bill_detail bd " +
                        "JOIN bill b ON bd.bill_id = b.id " +
                        "WHERE b.payment_time BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC",
                dateFormat
        );
        return executeQuery(sql, filter);
    }

    /**
     * Tổng hợp các thống kê quan trọng trong khoảng thời gian được chỉ định.
     */
    public Map<String, List<Object[]>> getSummaryStatistics(StatisticalParamFilter filter) {
        filter.setStartDate(adjustDateStart(filter.getStartDate()));
        filter.setEndDate(adjustDateEnd(filter.getEndDate()));

        Map<String, List<Object[]>> summary = new HashMap<>();
        summary.put("totalRevenue", getTotalRevenue(filter));
        summary.put("totalProductsSold", getTotalProductsSold(filter));
        summary.put("totalDiscountAmount", getTotalDiscountAmount(filter));
        summary.put("totalProductAmount", getTotalProductAmount(filter));
        summary.put("customerRegistrations", getCustomerRegistrations(filter));
        summary.put("totalBillsByStatus", getTotalBillsByStatus(filter));
        return summary;
    }

    /**
     * Lấy danh sách các sản phẩm bán chạy nhất trong khoảng thời gian được chỉ định.
     */
    public List<Object[]> getTopSellingProducts(@NotNull StatisticalParamFilter filter, int limit) {
        String dateFormat = resolveDateFormat(filter.getGranularity(), "b.payment_time");
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
        query.setParameter("startDate", adjustDateStart(filter.getStartDate()));
        query.setParameter("endDate", adjustDateEnd(filter.getEndDate()));
        query.setMaxResults(limit);
        return query.getResultList();
    }

    /**
     * Thống kê số lượng đơn hàng theo trạng thái (thành công, thất bại) trong khoảng thời gian.
     */
    public List<Object[]> getTotalBillsByStatus(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity(), "b.create_at");
        String sql = String.format(
                "SELECT %s AS period, " +
                        "SUM(CASE WHEN bs.id = 8 THEN 1 ELSE 0 END) AS success, " +
                        "SUM(CASE WHEN bs.id = 7 THEN 1 ELSE 0 END) AS failure " +
                        "FROM bill b " +
                        "JOIN bill_status bs ON b.bill_status_id = bs.id " +
                        "WHERE b.create_at BETWEEN :startDate AND :endDate " +
                        "AND bs.id IN (8, 7) " +
                        "GROUP BY period " +
                        "ORDER BY period ASC",
                dateFormat
        );

        // Thực thi truy vấn và trả về kết quả
        return executeQuery(sql, filter);
    }

    //------------------------------------------ THỐNG KÊ KHÁCH HÀNG ------------------------------------------//
    /**
     * Thống kê số lượng khách hàng đăng ký theo ngày, tuần, tháng, năm.
     */
    public List<Object[]> getCustomerRegistrations(StatisticalParamFilter filter) {
        String dateFormat = resolveDateFormat(filter.getGranularity(), "c.created_at");
        String sql = String.format(
                "SELECT %s AS period, COUNT(c.id) AS totalRegistrations " +
                        "FROM customers c " +
                        "WHERE c.created_at BETWEEN :startDate AND :endDate " +
                        "GROUP BY period " +
                        "ORDER BY period ASC",
                dateFormat
        );
        return executeQuery(sql, filter);
    }

}
