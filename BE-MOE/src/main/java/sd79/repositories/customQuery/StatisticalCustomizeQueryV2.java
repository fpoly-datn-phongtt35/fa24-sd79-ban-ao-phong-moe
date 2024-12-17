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

    //-------------------------------------------- Hoá đơn --------------------------------------------------------------//

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
                return "FUNCTION('DATE_FORMAT', b.paymentTime, '%Y-W%u')";
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
        if (filter.getPaymentMethod() != null)
            query.setParameter("paymentMethod", PaymentMethod.valueOf(filter.getPaymentMethod()));

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
        if (filter.getPaymentMethod() != null)
            query.setParameter("paymentMethod", PaymentMethod.valueOf(filter.getPaymentMethod()));

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
        if (filter.getPaymentMethod() != null)
            query.setParameter("paymentMethod", PaymentMethod.valueOf(filter.getPaymentMethod()));

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
        if (filter.getPaymentMethod() != null)
            query.setParameter("paymentMethod", PaymentMethod.valueOf(filter.getPaymentMethod()));

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
        if (filter.getPaymentMethod() != null)
            query.setParameter("paymentMethod", PaymentMethod.valueOf(filter.getPaymentMethod()));

        return query.getSingleResult() == null ? 0 : query.getSingleResult();
    }

    //-------------------------------------------- Sản phẩm --------------------------------------------------------------//
    public List<Object[]> getTopSellingProducts(StatisticalParamFilter filter) {
        StringBuilder queryStr = new StringBuilder("SELECT p.id AS productId, p.name AS productName, ")
                .append("SUM(bd.quantity) AS totalSold, pi.imageUrl AS productImage, MAX(b.paymentTime) AS saleDate ")
                .append("FROM BillDetail bd ")
                .append("JOIN bd.productDetail pd ")
                .append("JOIN pd.product p ")
                .append("JOIN bd.bill b ")
                .append("JOIN b.billStatus bs ")
                .append("LEFT JOIN p.productImages pi ")
                .append("WHERE 1=1 ");

        long status = (filter.getStatus() != null) ? filter.getStatus() : 8;

        // Apply filters based on the passed parameters
        if (filter.getStartDate() != null) {
            queryStr.append("AND b.paymentTime >= :startDate ");
        }
        if (filter.getEndDate() != null) {
            queryStr.append("AND b.paymentTime <= :endDate ");
        }
        if (filter.getPaymentMethod() != null) {
            try {
                // Convert the string to the corresponding enum
                PaymentMethod paymentMethod = PaymentMethod.valueOf(filter.getPaymentMethod().toUpperCase());
                queryStr.append(" AND b.paymentMethod = :paymentMethod ");
            } catch (IllegalArgumentException e) {
                // Handle the case where the string is not a valid enum value
                throw new IllegalArgumentException("Invalid payment method: " + filter.getPaymentMethod(), e);
            }
        }

        queryStr.append("AND bs.id = :status ");

        // Group by product and order by total sold quantity
        queryStr.append("GROUP BY p.id, p.name, pi.imageUrl ");
        queryStr.append("ORDER BY totalSold DESC ");

        // Create the query
        TypedQuery<Object[]> query = entityManager.createQuery(queryStr.toString(), Object[].class);

        // Set the filter parameters
        if (filter.getStartDate() != null) {
            query.setParameter("startDate", filter.getStartDate());
        }
        if (filter.getEndDate() != null) {
            query.setParameter("endDate", filter.getEndDate());
        }
        if (filter.getPaymentMethod() != null) {
            // Pass the enum value instead of a string
            PaymentMethod paymentMethod = PaymentMethod.valueOf(filter.getPaymentMethod().toUpperCase());
            query.setParameter("paymentMethod", paymentMethod);
        }

        query.setParameter("status", status);

        // Limit results to 5
        query.setMaxResults(5);

        return query.getResultList();
    }

    public List<Object[]> getTopCustomers(StatisticalParamFilter filter) {
        StringBuilder queryStr = new StringBuilder();
        queryStr.append("SELECT c.id AS customerId, ")
                .append("CONCAT(c.firstName, ' ', c.lastName) AS customerName, ")
                .append("c.phoneNumber AS phoneNumber, ")
                .append("SUM(bd.quantity) AS totalProductsBought, ")
                .append("SUM(b.total) AS totalSpent, ")
                .append(buildGranularityCondition(filter.getGranularity()))
                .append(" AS timeGranularity ")
                .append("FROM Bill b ")
                .append("JOIN b.customer c ")
                .append("JOIN b.billDetails bd ")
                .append("WHERE 1=1 ");

        // Add filtering conditions based on the granularity and time filters
        if (filter.getStartDate() != null) queryStr.append(" AND b.paymentTime >= :startDate");
        if (filter.getEndDate() != null) queryStr.append(" AND b.paymentTime <= :endDate");
        if (filter.getPaymentMethod() != null) queryStr.append(" AND b.paymentMethod = :paymentMethod");

        // Group by customer and granularity
        queryStr.append(" GROUP BY c.id, c.firstName, c.lastName, c.phoneNumber, ")
                .append(buildGranularityCondition(filter.getGranularity()));

        queryStr.append(" ORDER BY totalProductsBought DESC");

        TypedQuery<Object[]> query = entityManager.createQuery(queryStr.toString(), Object[].class);

        // Set parameters
        if (filter.getStartDate() != null) query.setParameter("startDate", filter.getStartDate());
        if (filter.getEndDate() != null) query.setParameter("endDate", filter.getEndDate());
        if (filter.getPaymentMethod() != null) {
            // Convert string to enum if necessary
            PaymentMethod paymentMethod = PaymentMethod.valueOf(filter.getPaymentMethod().toUpperCase());
            query.setParameter("paymentMethod", paymentMethod);
        }

        // Pagination
        int pageNo = filter.getPageNo() != null ? filter.getPageNo() : 0;
        int pageSize = filter.getPageSize() != null ? filter.getPageSize() : 5;
        query.setFirstResult(pageNo * pageSize);
        query.setMaxResults(pageSize);

        return query.getResultList();
    }

    public List<Object[]> getTopCoupons(StatisticalParamFilter filter) {
        StringBuilder queryStr = new StringBuilder("""
        SELECT c.id AS couponId, 
               c.code AS couponCode, 
               c.name AS couponName,
               c.discountValue AS discountValue, 
               COUNT(b.id) AS usageCount,
               MAX(b.paymentTime) AS lastUsedTime
        FROM Bill b
        JOIN b.coupon c
        WHERE 1=1
        """);

        // Add filtering conditions based on the granularity and time filters
        if (filter.getStartDate() != null) queryStr.append(" AND b.paymentTime >= :startDate");
        if (filter.getEndDate() != null) queryStr.append(" AND b.paymentTime <= :endDate");
        if (filter.getPaymentMethod() != null) queryStr.append(" AND b.paymentMethod = :paymentMethod");

        // Optionally group by the granularity (day, week, month, year)
        String granularityCondition = buildGranularityCondition(filter.getGranularity());
        queryStr.append(" GROUP BY c.id, c.code, c.name, c.discountValue, ")
                .append(granularityCondition);

        queryStr.append(" ORDER BY usageCount DESC");

        TypedQuery<Object[]> query = entityManager.createQuery(queryStr.toString(), Object[].class);

        // Set parameters
        if (filter.getStartDate() != null) query.setParameter("startDate", filter.getStartDate());
        if (filter.getEndDate() != null) query.setParameter("endDate", filter.getEndDate());
        if (filter.getPaymentMethod() != null) {
            // Convert string to enum if necessary
            PaymentMethod paymentMethod = PaymentMethod.valueOf(filter.getPaymentMethod().toUpperCase());
            query.setParameter("paymentMethod", paymentMethod);
        }

        // Pagination
        int pageNo = filter.getPageNo() != null ? filter.getPageNo() : 0;
        int pageSize = filter.getPageSize() != null ? filter.getPageSize() : 5;
        query.setFirstResult(pageNo * pageSize);
        query.setMaxResults(pageSize);

        return query.getResultList();
    }

}
