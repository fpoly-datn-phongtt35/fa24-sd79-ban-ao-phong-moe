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
import sd79.dto.requests.common.ProductParamFilter;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.clients.product.ProductClientResponse;
import sd79.dto.response.productResponse.ProductResponse;
import sd79.enums.ProductStatus;
import sd79.model.Product;
import sd79.model.ProductImage;
import sd79.repositories.products.ProductDetailRepository;

import java.math.BigDecimal;
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

    public PageableResponse getAllProducts(ProductParamFilter param) {
        StringBuilder sql = new StringBuilder("SELECT prd FROM Product prd WHERE prd.isDeleted = false");
        if (StringUtils.hasLength(param.getKeyword())) {
            sql.append(" AND lower(prd.name) like lower(:keyword)");
        }

        if (param.getStatus() != ProductStatus.ALL && param.getStatus() != ProductStatus.OUT_OF_STOCK) {
            sql.append(" AND prd.status = :status");
        } else if (param.getStatus() == ProductStatus.OUT_OF_STOCK) {
            sql.append(" AND ((SELECT coalesce(sum(d.quantity), 0) FROM ProductDetail d WHERE d.product.id = prd.id AND d.status = 'ACTIVE') < 1)");
        }

        if (StringUtils.hasLength(param.getCategory())) {
            sql.append(" AND prd.category.name like :category");
        }

        if (StringUtils.hasLength(param.getBrand())) {
            sql.append(" AND prd.brand.name like :brand");
        }

        if (StringUtils.hasLength(param.getMaterial())) {
            sql.append(" AND prd.material.name like :material");
        }

        if (StringUtils.hasLength(param.getOrigin())) {
            sql.append(" AND prd.origin like :origin");
        }

        sql.append(" ORDER BY prd.id DESC");

        TypedQuery<Product> query = entityManager.createQuery(sql.toString(), Product.class);
        if (StringUtils.hasLength(param.getKeyword())) {
            query.setParameter("keyword", String.format(LIKE_FORMAT, param.getKeyword().trim()));
        }
        if (param.getStatus() != ProductStatus.ALL && param.getStatus() != ProductStatus.OUT_OF_STOCK) {
            query.setParameter("status", param.getStatus());
        }
        if (StringUtils.hasLength(param.getCategory())) {
            query.setParameter("category", param.getCategory());
        }

        if (StringUtils.hasLength(param.getBrand())) {
            query.setParameter("brand", param.getBrand());
        }

        if (StringUtils.hasLength(param.getMaterial())) {
            query.setParameter("material", param.getMaterial());
        }

        if (StringUtils.hasLength(param.getOrigin())) {
            query.setParameter("origin", param.getOrigin());
        }

        query.setFirstResult((param.getPageNo() - 1) * param.getPageSize());
        query.setMaxResults(param.getPageSize());

        List<ProductResponse> data = query.getResultList().stream().map(this::convertToProductResponse).toList();

        // TODO count product
        StringBuilder countPage = new StringBuilder("SELECT count(prd) FROM Product prd WHERE prd.isDeleted = false");
        if (StringUtils.hasLength(param.getKeyword())) {
            countPage.append(" AND lower(prd.name) like lower(:keyword)");
        }

        if (param.getStatus() != ProductStatus.ALL && param.getStatus() != ProductStatus.OUT_OF_STOCK) {
            countPage.append(" AND prd.status = :status");
        } else if (param.getStatus() == ProductStatus.OUT_OF_STOCK) {
            countPage.append(" AND ((SELECT coalesce(sum(d.quantity), 0) FROM ProductDetail d WHERE d.product.id = prd.id AND d.status = 'ACTIVE') < 1)");
        }
        if (StringUtils.hasLength(param.getCategory())) {
            countPage.append(" AND prd.category.name like :category");
        }

        if (StringUtils.hasLength(param.getBrand())) {
            countPage.append(" AND prd.brand.name like :brand");
        }

        if (StringUtils.hasLength(param.getMaterial())) {
            countPage.append(" AND prd.material.name like :material");
        }

        if (StringUtils.hasLength(param.getOrigin())) {
            countPage.append(" AND prd.origin like :origin");
        }

        TypedQuery<Long> countQuery = entityManager.createQuery(countPage.toString(), Long.class);
        if (StringUtils.hasLength(param.getKeyword())) {
            countQuery.setParameter("keyword", String.format(LIKE_FORMAT, param.getKeyword().trim()));
        }
        if (param.getStatus() != ProductStatus.ALL && param.getStatus() != ProductStatus.OUT_OF_STOCK) {
            countQuery.setParameter("status", param.getStatus());
        }
        if (StringUtils.hasLength(param.getCategory())) {
            countQuery.setParameter("category", param.getCategory());
        }

        if (StringUtils.hasLength(param.getBrand())) {
            countQuery.setParameter("brand", param.getBrand());
        }

        if (StringUtils.hasLength(param.getMaterial())) {
            countQuery.setParameter("material", param.getMaterial());
        }

        if (StringUtils.hasLength(param.getOrigin())) {
            countQuery.setParameter("origin", param.getOrigin());
        }
        Long totalElements = countQuery.getSingleResult();
        Pageable pageable = PageRequest.of(param.getPageNo() - 1, param.getPageSize());
        Page<?> page = new PageImpl<>(data, pageable, totalElements);
        return PageableResponse.builder()
                .pageNumber(param.getPageNo())
                .pageNo(param.getPageNo())
                .pageSize(param.getPageSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements()) // Not required
                .content(data)
                .build();
    }

    public PageableResponse getAllProductArchives(ProductParamFilter param) {
        StringBuilder sql = new StringBuilder("SELECT prd FROM Product prd WHERE prd.isDeleted = true");
        if (StringUtils.hasLength(param.getKeyword())) {
            sql.append(" AND lower(prd.name) like lower(:keyword)");
        }

        if (param.getStatus() != ProductStatus.ALL && param.getStatus() != ProductStatus.OUT_OF_STOCK) {
            sql.append(" AND prd.status = :status");
        } else if (param.getStatus() == ProductStatus.OUT_OF_STOCK) {
            sql.append(" AND ((SELECT coalesce(sum(d.quantity), 0) FROM ProductDetail d WHERE d.product.id = prd.id AND d.status = 'ACTIVE') < 1)");
        }

        if (StringUtils.hasLength(param.getCategory())) {
            sql.append(" AND prd.category.name like :category");
        }

        if (StringUtils.hasLength(param.getBrand())) {
            sql.append(" AND prd.brand.name like :brand");
        }

        if (StringUtils.hasLength(param.getMaterial())) {
            sql.append(" AND prd.material.name like :material");
        }

        if (StringUtils.hasLength(param.getOrigin())) {
            sql.append(" AND prd.origin like :origin");
        }

        sql.append(" ORDER BY prd.updateAt DESC");

        TypedQuery<Product> query = entityManager.createQuery(sql.toString(), Product.class);
        if (StringUtils.hasLength(param.getKeyword())) {
            query.setParameter("keyword", String.format(LIKE_FORMAT, param.getKeyword().trim()));
        }
        if (param.getStatus() != ProductStatus.ALL && param.getStatus() != ProductStatus.OUT_OF_STOCK) {
            query.setParameter("status", param.getStatus());
        }
        if (StringUtils.hasLength(param.getCategory())) {
            query.setParameter("category", param.getCategory());
        }

        if (StringUtils.hasLength(param.getBrand())) {
            query.setParameter("brand", param.getBrand());
        }

        if (StringUtils.hasLength(param.getMaterial())) {
            query.setParameter("material", param.getMaterial());
        }

        if (StringUtils.hasLength(param.getOrigin())) {
            query.setParameter("origin", param.getOrigin());
        }

        query.setFirstResult((param.getPageNo() - 1) * param.getPageSize());
        query.setMaxResults(param.getPageSize());

        List<ProductResponse> data = query.getResultList().stream().map(this::convertToProductResponse).toList();

        // TODO count product
        StringBuilder countPage = new StringBuilder("SELECT count(prd) FROM Product prd WHERE prd.isDeleted = true");
        if (StringUtils.hasLength(param.getKeyword())) {
            countPage.append(" AND lower(prd.name) like lower(:keyword)");
        }

        if (param.getStatus() != ProductStatus.ALL && param.getStatus() != ProductStatus.OUT_OF_STOCK) {
            countPage.append(" AND prd.status = :status");
        } else if (param.getStatus() == ProductStatus.OUT_OF_STOCK) {
            countPage.append(" AND ((SELECT coalesce(sum(d.quantity), 0) FROM ProductDetail d WHERE d.product.id = prd.id AND d.status = 'ACTIVE') < 1)");
        }
        if (StringUtils.hasLength(param.getCategory())) {
            countPage.append(" AND prd.category.name like :category");
        }

        if (StringUtils.hasLength(param.getBrand())) {
            countPage.append(" AND prd.brand.name like :brand");
        }

        if (StringUtils.hasLength(param.getMaterial())) {
            countPage.append(" AND prd.material.name like :material");
        }

        if (StringUtils.hasLength(param.getOrigin())) {
            countPage.append(" AND prd.origin like :origin");
        }

        TypedQuery<Long> countQuery = entityManager.createQuery(countPage.toString(), Long.class);
        if (StringUtils.hasLength(param.getKeyword())) {
            countQuery.setParameter("keyword", String.format(LIKE_FORMAT, param.getKeyword().trim()));
        }
        if (param.getStatus() != ProductStatus.ALL && param.getStatus() != ProductStatus.OUT_OF_STOCK) {
            countQuery.setParameter("status", param.getStatus());
        }
        if (StringUtils.hasLength(param.getCategory())) {
            countQuery.setParameter("category", param.getCategory());
        }

        if (StringUtils.hasLength(param.getBrand())) {
            countQuery.setParameter("brand", param.getBrand());
        }

        if (StringUtils.hasLength(param.getMaterial())) {
            countQuery.setParameter("material", param.getMaterial());
        }

        if (StringUtils.hasLength(param.getOrigin())) {
            countQuery.setParameter("origin", param.getOrigin());
        }
        Long totalElements = countQuery.getSingleResult();
        Pageable pageable = PageRequest.of(param.getPageNo() - 1, param.getPageSize());
        Page<?> page = new PageImpl<>(data, pageable, totalElements);
        return PageableResponse.builder()
                .pageNumber(param.getPageNo())
                .pageNo(param.getPageNo())
                .pageSize(param.getPageSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements()) // Not required
                .content(data)
                .build();
    }

    public List<ProductClientResponse> getExploreOurProducts(Integer page) {
        StringBuilder query = new StringBuilder("SELECT prd FROM Product prd WHERE prd.status = 'ACTIVE' AND prd.isDeleted = false");
        query.append(" AND ((SELECT coalesce(sum(d.quantity), 0) FROM ProductDetail d WHERE d.product.id = prd.id AND d.status = 'ACTIVE') > 0)");
        query.append(" ORDER BY prd.updateAt DESC");
        TypedQuery<Product> execute = entityManager.createQuery(query.toString(), Product.class);
        execute.setFirstResult((page -  1) * 10);
        execute.setMaxResults(10);

        return execute.getResultList().stream()
                .map(s -> ProductClientResponse.builder()
                        .productId(s.getId())
                        .imageUrl(s.getProductImages().getFirst().getImageUrl())
                        .name(s.getName())
                        .retailPrice(s.getProductDetails().getFirst().getRetailPrice())
                        .discountPrice(s.getProductDetails().getFirst().getRetailPrice().multiply(BigDecimal.valueOf(1).subtract(BigDecimal.valueOf(0.50))))
                        .rate(4)
                        .rateCount(104)
                        .build()
                ).toList();
    }

    public List<ProductClientResponse> getBestSellingProducts() {
        StringBuilder query = new StringBuilder("SELECT prd FROM Product prd WHERE prd.status = 'ACTIVE' AND prd.isDeleted = false");
        query.append(" AND ((SELECT coalesce(sum(d.quantity), 0) FROM ProductDetail d WHERE d.product.id = prd.id AND d.status = 'ACTIVE') > 0)");
        query.append(" ORDER BY prd.updateAt DESC");
        TypedQuery<Product> execute = entityManager.createQuery(query.toString(), Product.class);
        execute.setMaxResults(6);

        return execute.getResultList().stream()
                .map(s -> ProductClientResponse.builder()
                        .productId(s.getId())
                        .imageUrl(s.getProductImages().getFirst().getImageUrl())
                        .name(s.getName())
                        .retailPrice(s.getProductDetails().getFirst().getRetailPrice())
                        .discountPrice(s.getProductDetails().getFirst().getRetailPrice().multiply(BigDecimal.valueOf(1).subtract(BigDecimal.valueOf(0.50))))
                        .rate(4)
                        .rateCount(104)
                        .build()
                ).toList();
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
