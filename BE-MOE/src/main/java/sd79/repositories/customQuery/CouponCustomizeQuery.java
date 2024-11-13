package sd79.repositories.customQuery;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import sd79.dto.requests.common.BillCouponFilter;
import sd79.dto.requests.common.CouponParamFilter;
import sd79.dto.response.CouponResponse;
import sd79.dto.response.PageableResponse;
import sd79.enums.TodoDiscountType;
import sd79.enums.TodoType;
import sd79.model.Coupon;
import sd79.model.CouponImage;
import sd79.model.CouponShare;
import sd79.model.Customer;
import sd79.repositories.CouponRepo;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class CouponCustomizeQuery {

    @PersistenceContext
    private EntityManager entityManager;

    private final CouponRepo couponRepo;

    private static final String LIKE_FORMAT = "%%%s%%";

    public PageableResponse getAllCoupons(CouponParamFilter param) {
        log.info("Executing query coupon with keyword={}", param.getKeyword());

        // Date formatting
        Date startDate = null;
        Date endDate = null;
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            if (StringUtils.hasLength(param.getStartDate())) {
                startDate = inputFormat.parse(param.getStartDate());
            }
            if (StringUtils.hasLength(param.getEndDate())) {
                endDate = inputFormat.parse(param.getEndDate());
            }
        } catch (ParseException e) {
            log.error("Error parsing dates: {}", e.getMessage());
        }

        // Build the main query
        StringBuilder sql = new StringBuilder("SELECT c FROM Coupon c WHERE c.isDeleted = false");

        // Keyword filtering
        if (StringUtils.hasLength(param.getKeyword())) {
            sql.append(" AND (lower(c.name) LIKE lower(:keyword) OR lower(c.code) LIKE lower(:keyword))");
        }

        // Status filtering
        if ("PENDING".equals(param.getStatus())) {
            sql.append(" AND Date(c.startDate) > CURRENT_DATE");
        } else if ("START".equals(param.getStatus())) {
            sql.append(" AND Date(c.startDate) <= CURRENT_DATE AND c.endDate >= CURRENT_DATE");
        } else if ("END".equals(param.getStatus())) {
            sql.append(" AND Date(c.endDate) < CURRENT_DATE");
        }

        // Type filtering
        if (param.getType() == TodoType.PUBLIC) {
            sql.append(" AND c.type = 'PUBLIC'");
        } else if (param.getType() == TodoType.PERSONAL) {
            sql.append(" AND c.type = 'PERSONAL'");
        }

        // Discount Type filtering
        if (param.getDiscountType() == TodoDiscountType.PERCENTAGE) {
            sql.append(" AND c.discountType = 'PERCENTAGE'");
        } else if (param.getDiscountType() == TodoDiscountType.FIXED_AMOUNT) {
            sql.append(" AND c.discountType = 'FIXED_AMOUNT'");
        }

        // Date range filtering
        if (startDate != null && endDate != null) {
            sql.append(" AND (Date(c.startDate) >= :startDate AND Date(c.endDate) <= :endDate)");
        }

        // Sorting logic
        if (StringUtils.hasLength(param.getSort()) && StringUtils.hasLength(param.getDirection())) {
            sql.append(" ORDER BY c.").append(param.getSort()).append(" ").append(param.getDirection().toUpperCase());
        } else {
            sql.append(" ORDER BY c.startDate ASC, c.endDate ASC");
        }

        // Create the query
        TypedQuery<Coupon> query = entityManager.createQuery(sql.toString(), Coupon.class);

        // Set query parameters
        if (StringUtils.hasLength(param.getKeyword())) {
            query.setParameter("keyword", "%" + param.getKeyword() + "%");
        }
        if (startDate != null && endDate != null) {
            query.setParameter("startDate", startDate);
            query.setParameter("endDate", endDate);
        }

        // Pagination settings
        query.setFirstResult((param.getPageNo() - 1) * param.getPageSize());
        query.setMaxResults(param.getPageSize());

        // Fetch data
        List<CouponResponse> data = query.getResultList().stream().map(this::convertCouponResponse).toList();

        // Build count query for pagination
        StringBuilder countSql = new StringBuilder("SELECT count(c) FROM Coupon c WHERE c.isDeleted = false");

        // Reapply filters for count query
        if (StringUtils.hasLength(param.getKeyword())) {
            countSql.append(" AND (lower(c.name) LIKE lower(:keyword) OR lower(c.code) LIKE lower(:keyword))");
        }
        if ("PENDING".equals(param.getStatus())) {
            countSql.append(" AND c.startDate > CURRENT_DATE");
        } else if ("START".equals(param.getStatus())) {
            countSql.append(" AND c.startDate <= CURRENT_DATE AND c.endDate >= CURRENT_DATE");
        } else if ("END".equals(param.getStatus())) {
            countSql.append(" AND c.endDate < CURRENT_DATE");
        }
        if (param.getType() == TodoType.PUBLIC) {
            countSql.append(" AND c.type = 'PUBLIC'");
        } else if (param.getType() == TodoType.PERSONAL) {
            countSql.append(" AND c.type = 'PERSONAL'");
        }
        if (param.getDiscountType() == TodoDiscountType.PERCENTAGE) {
            countSql.append(" AND c.discountType = 'PERCENTAGE'");
        } else if (param.getDiscountType() == TodoDiscountType.FIXED_AMOUNT) {
            countSql.append(" AND c.discountType = 'FIXED_AMOUNT'");
        }
        if (startDate != null && endDate != null) {
            countSql.append(" AND (Date(c.startDate) >= :startDate AND Date(c.endDate) <= :endDate)");
        }

        // Count query
        TypedQuery<Long> countQuery = entityManager.createQuery(countSql.toString(), Long.class);
        if (StringUtils.hasLength(param.getKeyword())) {
            countQuery.setParameter("keyword", "%" + param.getKeyword() + "%");
        }
        if (startDate != null && endDate != null) {
            countQuery.setParameter("startDate", startDate);
            countQuery.setParameter("endDate", endDate);
        }
        Long totalElements = countQuery.getSingleResult();

        // Build page response
        Pageable pageable = PageRequest.of(param.getPageNo() - 1, param.getPageSize());
        Page<CouponResponse> page = new PageImpl<>(data, pageable, totalElements);

        return PageableResponse.builder()
                .pageNumber(param.getPageNo())
                .pageSize(param.getPageSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .content(data)
                .build();
    }

    private CouponResponse convertCouponResponse(Coupon coupon) {
        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .type(coupon.getType())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .maxValue(coupon.getMaxValue())
                .quantity(coupon.getQuantity())
                .usageCount(coupon.getUsageCount())
                .conditions(coupon.getConditions())
                .startDate(coupon.getStartDate())
                .endDate(coupon.getEndDate())
                .status(coupon.getStatus())
                .description(coupon.getDescription())
                .imageUrl(convertToUrl(coupon.getCouponImage()))
                .build();
    }

    private String convertToUrl(CouponImage image) {
        return (image != null) ? image.getImageUrl() : null;
    }

    public PageableResponse getAllCouponCustomer(Long customerId, BillCouponFilter param) {
        log.info("Executing coupon query for customerId={} with search by name or code only", customerId);

        String sql = getString(param, customerId);
        TypedQuery<Coupon> query = entityManager.createQuery(sql, Coupon.class);
        if (StringUtils.hasLength(param.getKeyword())) {
            query.setParameter("keyword", "%" + param.getKeyword() + "%");
        }
        if (customerId != null) {
            query.setParameter("customerId", customerId);
        }
        query.setFirstResult((param.getPageNo() - 1) * param.getPageSize());
        query.setMaxResults(param.getPageSize());
        List<CouponResponse> data = query.getResultList().stream()
                .map(this::convertCouponResponse)
                .collect(Collectors.toList());
        String countSql = "SELECT COUNT(c) FROM Coupon c WHERE c.isDeleted = false ";
        if (customerId == null) {
            countSql += "AND c.type = 'PUBLIC' AND c.startDate <= CURRENT_DATE AND (c.endDate IS NULL OR c.endDate >= CURRENT_DATE) AND c.quantity > 0";
        } else {
            countSql += "AND ((" +
                    "c.type = 'PUBLIC' AND c.startDate <= CURRENT_DATE AND (c.endDate IS NULL OR c.endDate >= CURRENT_DATE) AND c.quantity > 0 " +
                    "AND NOT EXISTS (SELECT b FROM Bill b WHERE b.customer.id = :customerId AND b.coupon.id = c.id) " + // Ensure public coupon hasn't been used by this customer
                    ") " +
                    "OR (c.type = 'PERSONAL' AND EXISTS (SELECT cs FROM CouponShare cs WHERE cs.customer.id = :customerId AND cs.coupon.id = c.id) " +
                    "AND NOT EXISTS (SELECT b FROM Bill b WHERE b.customer.id = :customerId AND b.coupon.id = c.id))) "; // Ensure personal coupon hasn't been used by this customer
        }
            if (StringUtils.hasLength(param.getKeyword())) {
            countSql += "AND (LOWER(c.name) LIKE LOWER(:keyword) OR LOWER(c.code) LIKE LOWER(:keyword)) ";
        }
        TypedQuery<Long> countQuery = entityManager.createQuery(countSql, Long.class);
        if (StringUtils.hasLength(param.getKeyword())) {
            countQuery.setParameter("keyword", "%" + param.getKeyword() + "%");
        }
        if (customerId != null) {
            countQuery.setParameter("customerId", customerId);
        }
        Long totalElements = countQuery.getSingleResult();
        Pageable pageable = PageRequest.of(param.getPageNo() - 1, param.getPageSize());
        Page<CouponResponse> page = new PageImpl<>(data, pageable, totalElements);

        return PageableResponse.builder()
                .pageNumber(param.getPageNo())
                .pageSize(param.getPageSize())
                .totalPages(page.getTotalPages())
                .totalElements(totalElements)
                .content(data)
                .build();
    }

    private String getString(BillCouponFilter param, Long customerId) {
        String sql = "SELECT c FROM Coupon c WHERE c.isDeleted = false AND c.startDate <= CURRENT_DATE AND (c.endDate IS NULL OR c.endDate >= CURRENT_DATE)";

        if (customerId == null) {
            sql += "AND c.type = 'PUBLIC' AND c.quantity > 0 " +
                    "AND NOT EXISTS (SELECT b FROM Bill b WHERE b.coupon.id = c.id)";
        } else {
            sql += "AND ((" +
                    "c.type = 'PUBLIC' AND c.quantity > 0 " +
                    "AND NOT EXISTS (SELECT b FROM Bill b WHERE b.customer.id = :customerId AND b.coupon.id = c.id) " +
                    ") " +
                    "OR (c.type = 'PERSONAL' AND EXISTS (SELECT cs FROM CouponShare cs WHERE cs.customer.id = :customerId AND cs.coupon.id = c.id) " +
                    "AND NOT EXISTS (SELECT b FROM Bill b WHERE b.customer.id = :customerId AND b.coupon.id = c.id))) ";
        }

        sql += "AND (c.type != 'PERSONAL' OR c.quantity > 0) ";

        if (StringUtils.hasLength(param.getKeyword())) {
            sql += "AND (LOWER(c.name) LIKE LOWER(:keyword) OR LOWER(c.code) LIKE LOWER(:keyword)) ";
        }

        return sql;
    }




//    private String getString(BillCouponFilter param, Long customerId) {
//        String sql = "SELECT c FROM Coupon c WHERE c.isDeleted = false ";
//
//        if (customerId == null) {
//            sql += "AND c.type = 'PUBLIC' AND c.startDate <= CURRENT_DATE AND (c.endDate IS NULL OR c.endDate >= CURRENT_DATE) " +
//                    "AND c.quantity > 0 ";
//        } else {
//            sql += "AND ((" +
//                    "c.type = 'PUBLIC' AND c.startDate <= CURRENT_DATE AND (c.endDate IS NULL OR c.endDate >= CURRENT_DATE) " +
//                    "AND c.quantity > 0 " +
//                    ") " +
//                    "OR (c.type = 'PERSONAL' AND EXISTS (SELECT cs FROM CouponShare cs WHERE cs.customer.id = :customerId AND cs.coupon.id = c.id) " +
//                    "AND NOT EXISTS (SELECT b FROM Bill b WHERE b.customer.id = :customerId AND b.coupon.id = c.id))) ";
//        }
//
//        // Ensure all coupon types have quantity > 0 except for personal ones (handled above)
//        sql += "AND (c.type != 'PERSONAL' OR c.quantity > 0) ";
//
//        if (StringUtils.hasLength(param.getKeyword())) {
//            sql += "AND (LOWER(c.name) LIKE LOWER(:keyword) OR LOWER(c.code) LIKE LOWER(:keyword)) ";
//        }
//
//        return sql;
//    }
}
