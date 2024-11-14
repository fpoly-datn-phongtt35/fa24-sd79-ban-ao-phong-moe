/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.repositories.invoice_client;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.clients.invoices.InvoiceResponse;
import sd79.enums.ProductStatus;
import sd79.exception.InvalidDataException;
import sd79.model.Bill;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class InvoiceRepository {
    @PersistenceContext
    private EntityManager entityManager;

    private static final String LIKE_FORMAT = "%%%s%%";

    public PageableResponse getAllInvoices(InvoiceResponse.Param param) {
        String defaultQuery = """
                SELECT b FROM Bill b WHERE customer.user.id = :userId
                """;
        StringBuilder sql = new StringBuilder(defaultQuery);

        if (StringUtils.hasLength(param.getKeyword())) {
            sql.append(" AND lower(b.code) like lower(:keyword)");
        }

        if (param.getStatus() != 0) {
            if (param.getStatus() >= 1 && param.getStatus() <= 8) {
                sql.append(" AND b.billStatus.id = :status");
            } else {
                throw new InvalidDataException("Status invalid");
            }
        }

        if (param.getStatus() == null) {
            sql.append(" AND b.billStatus IS NOT NULL");
        }

        sql.append(" ORDER BY b.createAt DESC");
        TypedQuery<Bill> query = entityManager.createQuery(sql.toString(), Bill.class);
        query.setParameter("userId", param.getUserId());

        if (StringUtils.hasLength(param.getKeyword())) {
            query.setParameter("keyword", String.format(LIKE_FORMAT, param.getKeyword().trim()));
        }

        if (param.getStatus() != 0) {
            if (param.getStatus() >= 1 && param.getStatus() <= 8) {
                query.setParameter("status", param.getStatus());
            } else {
                throw new InvalidDataException("Status invalid");
            }
        }

        query.setFirstResult((param.getPageNo() - 1) * param.getPageSize());
        query.setMaxResults(param.getPageSize());

        List<InvoiceResponse.Invoice> invoices = query.getResultList().stream().map(i ->
                InvoiceResponse.Invoice.builder()
                        .id(i.getId())
                        .code(i.getCode())
                        .quantity(i.getBillDetails().size())
                        .subtotal(i.getSubtotal())
                        .sellDiscount(i.getSellerDiscount())
                        .shippingFee(i.getShipping())
                        .totalAmount(i.getTotal())
                        .status(InvoiceResponse.InvoiceStatus.builder()
                                .id(i.getBillStatus().getId())
                                .name(i.getBillStatus().getName())
                                .status(i.getBillStatus().getStatus())
                                .build())
                        .paymentTime(i.getPaymentTime())
                        .orderDate(i.getCreateAt())
                        .products(i.getBillDetails().stream().map(prd ->
                                InvoiceResponse.Product.builder()
                                        .id(prd.getId())
                                        .name(String.format("%s [%s - %s]", prd.getProductDetail().getProduct().getName(), prd.getProductDetail().getSize().getName(), prd.getProductDetail().getColor().getName()))
                                        .imageUrl(prd.getProductDetail().getProduct().getProductImages().getFirst().getImageUrl())
                                        .status(prd.getQuantity() > 0 || prd.getProductDetail().getStatus() == ProductStatus.ACTIVE || prd.getProductDetail().getProduct().getStatus() == ProductStatus.ACTIVE)
                                        .quantity(prd.getQuantity())
                                        .productId(prd.getProductDetail().getProduct().getId())
                                        .category(prd.getProductDetail().getProduct().getCategory().getName())
                                        .retailPrice(prd.getRetailPrice())
                                        .discountPrice(prd.getDiscountAmount())
                                        .totalAmount(prd.getTotalAmountProduct())
                                        .build()
                        ).toList())
                        .paymentMethod(i.getPaymentMethod())
                        .build()
        ).toList();

        StringBuilder countPage = new StringBuilder("SELECT count(b) FROM Bill b WHERE customer.user.id = :userId");
        if (param.getStatus() == null) {
            countPage.append(" AND b.billStatus IS NOT NULL");
        }

        if (StringUtils.hasLength(param.getKeyword())) {
            countPage.append(" AND lower(b.code) like lower(:keyword)");
        }

        if (param.getStatus() != 0) {
            if (param.getStatus() >= 1 && param.getStatus() <= 8) {
                countPage.append(" AND b.billStatus.id = :status");
            } else {
                throw new InvalidDataException("Status invalid");
            }
        }

        TypedQuery<Long> countQuery = entityManager.createQuery(countPage.toString(), Long.class);
        countQuery.setParameter("userId", param.getUserId());

        if (StringUtils.hasLength(param.getKeyword())) {
            countQuery.setParameter("keyword", String.format(LIKE_FORMAT, param.getKeyword().trim()));
        }

        if (param.getStatus() != 0) {
            if (param.getStatus() >= 1 && param.getStatus() <= 8) {
                countQuery.setParameter("status", param.getStatus());
            } else {
                throw new InvalidDataException("Status invalid");
            }
        }

        Long totalElements = countQuery.getSingleResult();
        Pageable pageable = PageRequest.of(param.getPageNo() - 1, param.getPageSize());
        Page<?> page = new PageImpl<>(invoices, pageable, totalElements);
        return PageableResponse.builder()
                .pageNumber(param.getPageNo())
                .pageNo(param.getPageNo())
                .pageSize(param.getPageSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements()) // Not required
                .content(invoices)
                .build();
    }
}
