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
import sd79.dto.response.PageableResponse;
import sd79.dto.response.productResponse.ProductResponse;
import sd79.enums.ProductStatus;
import sd79.model.Product;
import sd79.model.ProductImage;
import sd79.repositories.products.ProductDetailRepository;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProductCustomizeQuery {
    @PersistenceContext
    private EntityManager entityManager;

    private final ProductDetailRepository productDetailRepository;

    private static final String LIKE_FORMAT = "%%%s%%";

    public PageableResponse getAllProducts(Integer pageNo, Integer pageSize, String keyword, ProductStatus status, String category, String brand, String material, String origin) {
        log.info("Executing query product with keyword={}", keyword);
        StringBuilder sql = new StringBuilder("SELECT prd FROM Product prd WHERE prd.isDeleted = false");
        if (StringUtils.hasLength(keyword)) {
            sql.append(" AND lower(prd.name) like lower(:keyword)");
        }

        if (status != ProductStatus.ALL && status != ProductStatus.OUT_OF_STOCK) {
            sql.append(" AND prd.status = :status");
        } else if (status == ProductStatus.OUT_OF_STOCK) {
            sql.append(" AND ((SELECT SUM(d.quantity) FROM ProductDetail d WHERE d.product.id = prd.id) < 1)");
        }

        if (StringUtils.hasLength(category)) {
            sql.append(" AND prd.category.name like :category");
        }

        if (StringUtils.hasLength(brand)) {
            sql.append(" AND prd.brand.name like :brand");
        }

        if (StringUtils.hasLength(material)) {
            sql.append(" AND prd.material.name like :material");
        }

        if (StringUtils.hasLength(origin)) {
            sql.append(" AND prd.origin like :origin");
        }

        TypedQuery<Product> query = entityManager.createQuery(sql.toString(), Product.class);
        if (StringUtils.hasLength(keyword)) {
            query.setParameter("keyword", String.format(LIKE_FORMAT, keyword));
        }
        if (status != ProductStatus.ALL && status != ProductStatus.OUT_OF_STOCK) {
            query.setParameter("status", status);
        }
        if (StringUtils.hasLength(category)) {
            query.setParameter("category", category);
        }

        if (StringUtils.hasLength(brand)) {
            query.setParameter("brand", brand);
        }

        if (StringUtils.hasLength(material)) {
            query.setParameter("material", material);
        }

        if (StringUtils.hasLength(origin)) {
            query.setParameter("origin", origin);
        }

        query.setFirstResult((pageNo - 1) * pageSize);
        query.setMaxResults(pageSize);

        List<ProductResponse> data = query.getResultList().stream().map(this::convertToProductResponse).toList();

        // TODO count products
        StringBuilder countPage = new StringBuilder("SELECT count(prd) FROM Product prd WHERE prd.isDeleted = false");
        if (StringUtils.hasLength(keyword)) {
            countPage.append(" AND lower(prd.name) like lower(:keyword)");
        }

        if (status != ProductStatus.ALL && status != ProductStatus.OUT_OF_STOCK) {
            countPage.append(" AND prd.status = :status");
        } else if (status == ProductStatus.OUT_OF_STOCK) {
            countPage.append(" AND ((SELECT SUM(d.quantity) FROM ProductDetail d WHERE d.product.id = prd.id) < 1)");
        }
        if (StringUtils.hasLength(category)) {
            countPage.append(" AND prd.category.name like :category");
        }

        if (StringUtils.hasLength(brand)) {
            countPage.append(" AND prd.brand.name like :brand");
        }

        if (StringUtils.hasLength(material)) {
            countPage.append(" AND prd.material.name like :material");
        }

        if (StringUtils.hasLength(origin)) {
            countPage.append(" AND prd.origin like :origin");
        }

        TypedQuery<Long> countQuery = entityManager.createQuery(countPage.toString(), Long.class);
        if (StringUtils.hasLength(keyword)) {
            countQuery.setParameter("keyword", String.format(LIKE_FORMAT, keyword));
        }
        if (status != ProductStatus.ALL && status != ProductStatus.OUT_OF_STOCK) {
            countQuery.setParameter("status", status);
        }
        if (StringUtils.hasLength(category)) {
            countQuery.setParameter("category", category);
        }

        if (StringUtils.hasLength(brand)) {
            countQuery.setParameter("brand", brand);
        }

        if (StringUtils.hasLength(material)) {
            countQuery.setParameter("material", material);
        }

        if (StringUtils.hasLength(origin)) {
            countQuery.setParameter("origin", origin);
        }
        Long totalElements = countQuery.getSingleResult();
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        Page<?> page = new PageImpl<>(data, pageable, totalElements);
        return PageableResponse.builder()
                .pageNumber(pageNo)
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements()) // Not required
                .content(data)
                .build();
    }

    private ProductResponse convertToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .imageUrl(convertToUrl(product.getProductImages()))
                .name(product.getName())
                .description(product.getDescription())
                .status(product.getStatus())
                .category(product.getCategory().getName())
                .brand(product.getBrand().getName())
                .material(product.getMaterial().getName())
                .origin(product.getOrigin())
                .createdBy(product.getCreatedBy().getUsername())
                .updatedBy(product.getUpdatedBy().getUsername())
                .createdAt(product.getCreateAt())
                .updatedAt(product.getUpdateAt())
                .productQuantity(this.productDetailRepository.countByProductId(product.getId()))
                .build();
    }

    private List<String> convertToUrl(List<ProductImage> images) {
        return images.stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
    }
}
