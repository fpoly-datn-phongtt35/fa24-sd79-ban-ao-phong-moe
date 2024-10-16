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
import sd79.dto.response.CouponResponse;
import sd79.dto.response.PageableResponse;
import sd79.enums.TodoDiscountType;
import sd79.enums.TodoType;
import sd79.model.Coupon;
import sd79.model.CouponImage;
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


    public PageableResponse getAllCoupons(Integer pageNo, Integer pageSize, String keyword, TodoType type, TodoDiscountType discountType, String startDateStr, String endDateStr, String status, String sort, String direction) {
        log.info("Executing query coupon with keyword={}", keyword);

        // Convert the date format if necessary
        Date startDate = null;
        Date endDate = null;
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            if (StringUtils.hasLength(startDateStr)) {
                startDate = inputFormat.parse(startDateStr);
            }
            if (StringUtils.hasLength(endDateStr)) {
                endDate = inputFormat.parse(endDateStr);
            }
        } catch (ParseException e) {
            log.error("Error parsing dates: {}", e.getMessage());
        }

        StringBuilder sql = new StringBuilder("SELECT c FROM Coupon c WHERE c.isDeleted = false");

        // Keyword filtering
        if (StringUtils.hasLength(keyword)) {
            sql.append(" AND lower(c.name) like lower(:keyword) OR lower(c.code) like lower(:keyword)");
        }

        // Status filtering
        if ("PENDING".equals(status)) {
            sql.append(" AND c.startDate > CURRENT_DATE");
        } else if ("START".equals(status)) {
            sql.append(" AND c.startDate <= CURRENT_DATE AND c.endDate >= CURRENT_DATE");
        } else if ("END".equals(status)) {
            sql.append(" AND c.endDate < CURRENT_DATE");
        }

        // Type filtering
        if (type == TodoType.PUBLIC) {
            sql.append(" AND c.type = 'PUBLIC'");
        } else if (type == TodoType.PERSONAL) {
            sql.append(" AND c.type = 'PERSONAL'");
        } else {
            sql.append(" AND (c.type = 'PUBLIC' OR c.type = 'PERSONAL')");
        }

        // Discount Type filtering
        if (discountType == TodoDiscountType.PERCENTAGE) {
            sql.append(" AND c.discountType = 'PERCENTAGE'");
        } else if (discountType == TodoDiscountType.FIXED_AMOUNT) {
            sql.append(" AND c.discountType = 'FIXED_AMOUNT'");
        } else {
            sql.append(" AND (c.discountType = 'PERCENTAGE' OR c.discountType = 'FIXED_AMOUNT')");
        }

        // Date range filtering (between startDate and endDate)
        if (startDate != null && endDate != null) {
            sql.append(" AND ((Date(c.startDate) BETWEEN :startDate AND :endDate) AND (Date(c.endDate) BETWEEN :startDate AND :endDate))");
        }

        // Sorting (sort by column and direction)
        if (StringUtils.hasLength(sort) && StringUtils.hasLength(direction)) {
            sql.append(" ORDER BY c.").append(sort).append(" ").append(direction.toUpperCase());
        } else {
            // Default sorting if not provided: sort by startDate, then by endDate
            sql.append(" ORDER BY c.startDate ASC, c.endDate ASC");
        }

        TypedQuery<Coupon> query = entityManager.createQuery(sql.toString(), Coupon.class);

        // Set parameters
        if (StringUtils.hasLength(keyword)) {
            query.setParameter("keyword", String.format(LIKE_FORMAT, keyword));
        }
        if (startDate != null && endDate != null) {
            query.setParameter("startDate", startDate);
            query.setParameter("endDate", endDate);
        }

        // Pagination settings
        query.setFirstResult((pageNo - 1) * pageSize);
        query.setMaxResults(pageSize);

        List<CouponResponse> data = query.getResultList().stream().map(this::convertCouponResponse).toList();


        // Count query for pagination
        StringBuilder countPage = new StringBuilder("SELECT count(c) FROM Coupon c WHERE c.isDeleted = false");
        if (StringUtils.hasLength(keyword)) {
            countPage.append(" AND lower(c.name) like lower(:keyword) OR lower(c.code) like lower(:keyword)");
        }
        if (startDate != null && endDate != null) {
            countPage.append(" AND ((Date(c.startDate) BETWEEN :startDate AND :endDate) OR (Date(c.endDate) BETWEEN :startDate AND :endDate))");
        }

        TypedQuery<Long> countQuery = entityManager.createQuery(countPage.toString(), Long.class);
        if (StringUtils.hasLength(keyword)) {
            countQuery.setParameter("keyword", String.format(LIKE_FORMAT, keyword));
        }
        if (startDate != null && endDate != null) {
            countQuery.setParameter("startDate", startDate);
            countQuery.setParameter("endDate", endDate);
        }
        Long totalElements = countQuery.getSingleResult();

        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        Page<?> page = new PageImpl<>(data, pageable, totalElements);

        return PageableResponse.builder()
                .pageNumber(pageNo)
                .pageSize(pageSize)
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


}
