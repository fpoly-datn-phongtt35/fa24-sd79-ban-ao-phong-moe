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
import sd79.dto.requests.common.BillParamFilter;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.bills.ProductResponse;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BillCustomizeQuery {

    @PersistenceContext
    private EntityManager entityManager;

    public PageableResponse getAllBillProducts(BillParamFilter param) {
        StringBuilder query = new StringBuilder(
                "SELECT pd FROM ProductDetail pd WHERE pd.product.status = 'ACTIVE' " +
                        "AND pd.product.isDeleted = false " +
                        "AND pd.status = 'ACTIVE' " +
                        "AND pd.quantity > 0 "
        );

        if (param.getKeyword() != null && !param.getKeyword().isEmpty()) {
            query.append("AND pd.product.name LIKE :keyword ");
        }
        if (param.getSize() != null && !param.getSize().isEmpty()) {
            query.append("AND pd.size.name = :size ");
        }
        if (param.getColor() != null && !param.getColor().isEmpty()) {
            query.append("AND pd.color.name = :color ");
        }
        if (param.getBrand() != null && !param.getBrand().isEmpty()) {
            query.append("AND pd.product.brand.name = :brand ");
        }

        query.append("ORDER BY pd.product.updateAt DESC");

        // Create the main query
        TypedQuery<ProductResponse> typedQuery = entityManager.createQuery(query.toString(), ProductResponse.class);

        if (param.getKeyword() != null && !param.getKeyword().isEmpty()) {
            typedQuery.setParameter("keyword", "%" + param.getKeyword() + "%");
        }
        if (param.getSize() != null && !param.getSize().isEmpty()) {
            typedQuery.setParameter("size", param.getSize());
        }
        if (param.getColor() != null && !param.getColor().isEmpty()) {
            typedQuery.setParameter("color", param.getColor());
        }
        if (param.getBrand() != null && !param.getBrand().isEmpty()) {
            typedQuery.setParameter("brand", param.getBrand());
        }

        // Set pagination parameters
        typedQuery.setFirstResult((param.getPageNo() - 1) * param.getPageSize());
        typedQuery.setMaxResults(param.getPageSize());

        // Fetch paginated data
        List<ProductResponse> data = typedQuery.getResultList();

        // Count total elements
        StringBuilder countQuery = new StringBuilder(
                "SELECT COUNT(pd) FROM ProductDetail pd WHERE pd.product.status = 'ACTIVE' " +
                        "AND pd.product.isDeleted = false " +
                        "AND pd.status = 'ACTIVE' " +
                        "AND pd.quantity > 0 "
        );

        if (param.getKeyword() != null && !param.getKeyword().isEmpty()) {
            countQuery.append("AND pd.product.name LIKE :keyword ");
        }
        if (param.getSize() != null && !param.getSize().isEmpty()) {
            countQuery.append("AND pd.size.name = :size ");
        }
        if (param.getColor() != null && !param.getColor().isEmpty()) {
            countQuery.append("AND pd.color.name = :color ");
        }
        if (param.getBrand() != null && !param.getBrand().isEmpty()) {
            countQuery.append("AND pd.product.brand.name = :brand ");
        }

        TypedQuery<Long> countTypedQuery = entityManager.createQuery(countQuery.toString(), Long.class);

        if (param.getKeyword() != null && !param.getKeyword().isEmpty()) {
            countTypedQuery.setParameter("keyword", "%" + param.getKeyword() + "%");
        }
        if (param.getSize() != null && !param.getSize().isEmpty()) {
            countTypedQuery.setParameter("size", param.getSize());
        }
        if (param.getColor() != null && !param.getColor().isEmpty()) {
            countTypedQuery.setParameter("color", param.getColor());
        }
        if (param.getBrand() != null && !param.getBrand().isEmpty()) {
            countTypedQuery.setParameter("brand", param.getBrand());
        }

        Long totalElements = countTypedQuery.getSingleResult();
        Pageable pageable = PageRequest.of(param.getPageNo() - 1, param.getPageSize());
        Page<ProductResponse> page = new PageImpl<>(data, pageable, totalElements);

        // Return a PageableResponse with all pagination details
        return PageableResponse.builder()
                .pageNo(param.getPageNo())
                .pageSize(param.getPageSize())
                .totalElements(totalElements)
                .totalPages(page.getTotalPages())
                .content(data)
                .build();
    }
}
