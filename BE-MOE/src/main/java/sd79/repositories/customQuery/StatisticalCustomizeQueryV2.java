package sd79.repositories.customQuery;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Component;
import sd79.dto.requests.common.StatisticalParamFilter;
import sd79.enums.PaymentMethod;

import java.math.BigDecimal;
import java.util.List;

@Component
public class StatisticalCustomizeQueryV2 {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Object[]> getBillsWithFilters(StatisticalParamFilter filter) {
        StringBuilder queryStr = new StringBuilder(
                "SELECT "
                        + "CASE "
                        + "    WHEN :granularity = 'DAY' THEN FUNCTION('DATE', b.paymentTime) "
                        + "    WHEN :granularity = 'WEEK' THEN CONCAT(FUNCTION('YEAR', b.paymentTime), '-W', FUNCTION('WEEK', b.paymentTime)) "
                        + "    WHEN :granularity = 'MONTH' THEN FUNCTION('DATE_FORMAT', b.paymentTime, '%Y-%m') "
                        + "    WHEN :granularity = 'QUARTER' THEN CONCAT(FUNCTION('YEAR', b.paymentTime), '-Q', FUNCTION('QUARTER', b.paymentTime)) "
                        + "    WHEN :granularity = 'YEAR' THEN FUNCTION('YEAR', b.paymentTime) "
                        + "END AS timeGroup, "
                        + "SUM(b.total), COUNT(b.id) "
                        + "FROM Bill b WHERE 1=1"
        );

        // Thêm các điều kiện lọc
        if (filter.getStartDate() != null) queryStr.append(" AND b.paymentTime >= :startDate");
        if (filter.getEndDate() != null) queryStr.append(" AND b.paymentTime <= :endDate");
        if (filter.getStatus() != null) queryStr.append(" AND b.billStatus.id = :status");
        if (filter.getPaymentMethod() != null) queryStr.append(" AND b.paymentMethod = :paymentMethod");

        queryStr.append(" GROUP BY timeGroup ORDER BY timeGroup ASC");

        // Tạo query
        TypedQuery<Object[]> query = entityManager.createQuery(queryStr.toString(), Object[].class);

        // Thiết lập tham số
        query.setParameter("granularity", filter.getGranularity());
        if (filter.getStartDate() != null) query.setParameter("startDate", filter.getStartDate());
        if (filter.getEndDate() != null) query.setParameter("endDate", filter.getEndDate());
        if (filter.getStatus() != null) query.setParameter("status", filter.getStatus());
        if (filter.getPaymentMethod() != null) {
            query.setParameter("paymentMethod", PaymentMethod.valueOf(filter.getPaymentMethod()));
        }

        return query.getResultList();
    }

    private String buildGranularityCondition(String granularity) {
        switch (granularity.toUpperCase()) {
            case "DAY":
                return "FUNCTION('DATE', b.paymentTime)";
            case "WEEK":
                return "FUNCTION('YEARWEEK', b.paymentTime)";
            case "MONTH":
                return "FUNCTION('DATE_FORMAT', b.paymentTime, '%Y-%m')";
            case "QUARTER":
                return "CONCAT(FUNCTION('YEAR', b.paymentTime), '/', FUNCTION('QUARTER', b.paymentTime))";
            case "YEAR":
                return "FUNCTION('YEAR', b.paymentTime)";
            default:
                throw new IllegalArgumentException("Invalid granularity: " + granularity);
        }
    }

    public BigDecimal getAggregateValue(String function, StatisticalParamFilter filter) {
        StringBuilder queryStr = new StringBuilder("SELECT " + function + "(b.total) FROM Bill b WHERE 1=1");

        if (filter.getStartDate() != null) queryStr.append(" AND b.paymentTime >= :startDate");
        if (filter.getEndDate() != null) queryStr.append(" AND b.paymentTime <= :endDate");
        if (filter.getPaymentMethod() != null) queryStr.append(" AND b.paymentMethod = :paymentMethod");

        TypedQuery<BigDecimal> query = entityManager.createQuery(queryStr.toString(), BigDecimal.class);
        if (filter.getStartDate() != null) query.setParameter("startDate", filter.getStartDate());
        if (filter.getEndDate() != null) query.setParameter("endDate", filter.getEndDate());
        if (filter.getPaymentMethod() != null) query.setParameter("paymentMethod", PaymentMethod.valueOf(filter.getPaymentMethod()));

        return query.getSingleResult() == null ? BigDecimal.ZERO : query.getSingleResult();
    }

    public BigDecimal getTotalRevenue(StatisticalParamFilter filter) {
        return getAggregateValue("SUM", filter);
    }

    public BigDecimal getMinInvoice(StatisticalParamFilter filter) {
        return getAggregateValue("MIN", filter);
    }

    public BigDecimal getMaxInvoice(StatisticalParamFilter filter) {
        return getAggregateValue("MAX", filter);
    }

    public BigDecimal getAvgInvoice(StatisticalParamFilter filter) {
        StringBuilder queryStr = new StringBuilder("SELECT AVG(b.total) FROM Bill b WHERE 1=1");

        if (filter.getStartDate() != null) queryStr.append(" AND b.paymentTime >= :startDate");
        if (filter.getEndDate() != null) queryStr.append(" AND b.paymentTime <= :endDate");
        if (filter.getPaymentMethod() != null) queryStr.append(" AND b.paymentMethod = :paymentMethod");

        TypedQuery<Double> query = entityManager.createQuery(queryStr.toString(), Double.class);
        if (filter.getStartDate() != null) query.setParameter("startDate", filter.getStartDate());
        if (filter.getEndDate() != null) query.setParameter("endDate", filter.getEndDate());
        if (filter.getPaymentMethod() != null) query.setParameter("paymentMethod", PaymentMethod.valueOf(filter.getPaymentMethod()));

        Double result = query.getSingleResult();
        return result == null ? BigDecimal.ZERO : BigDecimal.valueOf(result);
    }

    public Long getTotalBills(StatisticalParamFilter filter) {
        StringBuilder queryStr = new StringBuilder("SELECT COUNT(b.id) FROM Bill b WHERE 1=1");

        if (filter.getStartDate() != null) queryStr.append(" AND b.paymentTime >= :startDate");
        if (filter.getEndDate() != null) queryStr.append(" AND b.paymentTime <= :endDate");
        if (filter.getPaymentMethod() != null) queryStr.append(" AND b.paymentMethod = :paymentMethod");

        TypedQuery<Long> query = entityManager.createQuery(queryStr.toString(), Long.class);
        if (filter.getStartDate() != null) query.setParameter("startDate", filter.getStartDate());
        if (filter.getEndDate() != null) query.setParameter("endDate", filter.getEndDate());
        if (filter.getPaymentMethod() != null) query.setParameter("paymentMethod", PaymentMethod.valueOf(filter.getPaymentMethod()));

        return query.getSingleResult() == null ? 0 : query.getSingleResult();
    }

    public Long getSuccessfulBills(StatisticalParamFilter filter) {
        return getBillsCountByStatus(filter, 8);
    }

    public Long getFailedBills(StatisticalParamFilter filter) {
        return getBillsCountByStatus(filter, 7);
    }

    public Long getUnpaidBills(StatisticalParamFilter filter) {
        StringBuilder queryStr = new StringBuilder("SELECT COUNT(b.id) FROM Bill b WHERE b.billStatus.id NOT IN (7, 8)");

        if (filter.getStartDate() != null) queryStr.append(" AND b.paymentTime >= :startDate");
        if (filter.getEndDate() != null) queryStr.append(" AND b.paymentTime <= :endDate");
        if (filter.getPaymentMethod() != null) queryStr.append(" AND b.paymentMethod = :paymentMethod");

        TypedQuery<Long> query = entityManager.createQuery(queryStr.toString(), Long.class);
        if (filter.getStartDate() != null) query.setParameter("startDate", filter.getStartDate());
        if (filter.getEndDate() != null) query.setParameter("endDate", filter.getEndDate());
        if (filter.getPaymentMethod() != null) query.setParameter("paymentMethod", PaymentMethod.valueOf(filter.getPaymentMethod()));

        return query.getSingleResult() == null ? 0 : query.getSingleResult();
    }

    private Long getBillsCountByStatus(StatisticalParamFilter filter, int status) {
        StringBuilder queryStr = new StringBuilder("SELECT COUNT(b.id) FROM Bill b WHERE b.billStatus.id = :status");

        if (filter.getStartDate() != null) queryStr.append(" AND b.paymentTime >= :startDate");
        if (filter.getEndDate() != null) queryStr.append(" AND b.paymentTime <= :endDate");
        if (filter.getPaymentMethod() != null) queryStr.append(" AND b.paymentMethod = :paymentMethod");

        TypedQuery<Long> query = entityManager.createQuery(queryStr.toString(), Long.class);
        query.setParameter("status", status);
        if (filter.getStartDate() != null) query.setParameter("startDate", filter.getStartDate());
        if (filter.getEndDate() != null) query.setParameter("endDate", filter.getEndDate());
        if (filter.getPaymentMethod() != null) query.setParameter("paymentMethod", PaymentMethod.valueOf(filter.getPaymentMethod()));

        return query.getSingleResult() == null ? 0 : query.getSingleResult();
    }

}
