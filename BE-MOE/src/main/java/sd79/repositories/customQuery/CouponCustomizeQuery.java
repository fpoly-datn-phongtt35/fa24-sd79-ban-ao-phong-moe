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
import sd79.dto.requests.common.CouponParamFilter;
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


    public PageableResponse getAllCoupons(CouponParamFilter param) {
        log.info("Executing query coupon with keyword={}", param.getKeyword());

        // Convert the date format if necessary
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

        StringBuilder sql = new StringBuilder("SELECT c FROM Coupon c WHERE c.isDeleted = false");

        // Keyword filtering
        if (StringUtils.hasLength(param.getKeyword())) {
            sql.append(" AND lower(c.name) like lower(:keyword) OR lower(c.code) like lower(:keyword)");
        }

        // Status filtering
        if ("PENDING".equals(param.getStatus())) {
            sql.append(" AND c.startDate > CURRENT_DATE");
        } else if ("START".equals(param.getStatus())) {
            sql.append(" AND c.startDate <= CURRENT_DATE AND c.endDate >= CURRENT_DATE");
        } else if ("END".equals(param.getStatus())) {
            sql.append(" AND c.endDate < CURRENT_DATE");
        }

        // Type filtering
        if (param.getType() == TodoType.PUBLIC) {
            sql.append(" AND c.type = 'PUBLIC'");
        } else if (param.getType() == TodoType.PERSONAL) {
            sql.append(" AND c.type = 'PERSONAL'");
        } else {
            sql.append(" AND (c.type = 'PUBLIC' OR c.type = 'PERSONAL')");
        }

        // Discount Type filtering
        if (param.getDiscountType() == TodoDiscountType.PERCENTAGE) {
            sql.append(" AND c.discountType = 'PERCENTAGE'");
        } else if (param.getDiscountType() == TodoDiscountType.FIXED_AMOUNT) {
            sql.append(" AND c.discountType = 'FIXED_AMOUNT'");
        } else {
            sql.append(" AND (c.discountType = 'PERCENTAGE' OR c.discountType = 'FIXED_AMOUNT')");
        }

        // Date range filtering (between startDate and endDate)
        if (startDate != null && endDate != null) {
            sql.append(" AND ((Date(c.startDate) BETWEEN :startDate AND :endDate) AND (Date(c.endDate) BETWEEN :startDate AND :endDate))");
        }

        // Sorting (sort by column and direction)
        if (StringUtils.hasLength(param.getSort()) && StringUtils.hasLength(param.getDirection())) {
            sql.append(" ORDER BY c.").append(param.getSort()).append(" ").append(param.getDirection().toUpperCase());
        } else {
            // Default sorting if not provided: sort by startDate, then by endDate
            sql.append(" ORDER BY c.startDate ASC, c.endDate ASC");
        }

        TypedQuery<Coupon> query = entityManager.createQuery(sql.toString(), Coupon.class);

        // Set parameters
        if (StringUtils.hasLength(param.getKeyword())) {
            query.setParameter("keyword", String.format(LIKE_FORMAT, param.getKeyword()));
        }
        if (startDate != null && endDate != null) {
            query.setParameter("startDate", startDate);
            query.setParameter("endDate", endDate);
        }

        // Pagination settings
        query.setFirstResult((param.getPageNo() - 1) * param.getPageSize());
        query.setMaxResults(param.getPageSize());

        List<CouponResponse> data = query.getResultList().stream().map(this::convertCouponResponse).toList();


        // Count query for pagination
        StringBuilder countPage = new StringBuilder("SELECT count(c) FROM Coupon c WHERE c.isDeleted = false");
        if (StringUtils.hasLength(param.getKeyword())) {
            countPage.append(" AND lower(c.name) like lower(:keyword) OR lower(c.code) like lower(:keyword)");
        }
        if (startDate != null && endDate != null) {
            countPage.append(" AND ((Date(c.startDate) BETWEEN :startDate AND :endDate) OR (Date(c.endDate) BETWEEN :startDate AND :endDate))");
        }

        TypedQuery<Long> countQuery = entityManager.createQuery(countPage.toString(), Long.class);
        if (StringUtils.hasLength(param.getKeyword())) {
            countQuery.setParameter("keyword", String.format(LIKE_FORMAT, param.getKeyword()));
        }
        if (startDate != null && endDate != null) {
            countQuery.setParameter("startDate", startDate);
            countQuery.setParameter("endDate", endDate);
        }
        Long totalElements = countQuery.getSingleResult();

        Pageable pageable = PageRequest.of(param.getPageNo() - 1, param.getPageSize());
        Page<?> page = new PageImpl<>(data, pageable, totalElements);

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
