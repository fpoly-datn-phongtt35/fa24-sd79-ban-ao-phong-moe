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
import org.springframework.stereotype.Repository;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.clients.invoices.InvoiceResponse;
import sd79.enums.ProductStatus;
import sd79.model.Bill;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class InvoiceRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public PageableResponse getAllInvoices(InvoiceResponse.Param param) {
        String defaultQuery = """
                SELECT b FROM Bill b WHERE customer.user.id = :userId
                """;
        StringBuilder sql = new StringBuilder(defaultQuery);

        if (param.getStatus() == null) {
            sql.append(" AND b.billStatus IS NOT NULL");
        }

        sql.append(" ORDER BY b.createAt DESC");
        TypedQuery<Bill> query = entityManager.createQuery(sql.toString(), Bill.class);
        query.setParameter("userId", param.getUserId());

//        query.setFirstResult((param.getPageNo() - 1) * param.getPageSize());
//        query.setMaxResults(param.getPageSize());

        List<InvoiceResponse.Invoice> invoices = query.getResultList().stream().map(i ->
                InvoiceResponse.Invoice.builder()
                        .code(i.getCode())
                        .quantity(i.getBillDetails().size())
                        .subtotal(i.getSubtotal())
                        .sellDiscount(i.getSellerDiscount())
                        .shippingFee(i.getShipping())
                        .totalAmount(i.getTotal())
                        .status(i.getBillStatus().getName())
                        .paymentTime(i.getPaymentTime())
                        .orderDate(i.getCreateAt())
                        .products(i.getBillDetails().stream().map(prd ->
                                InvoiceResponse.Product.builder()
                                        .id(prd.getId())
                                        .name(String.format("%s [%s - %s]", prd.getProductDetail().getProduct().getName(), prd.getProductDetail().getSize().getName(), prd.getProductDetail().getColor().getName()))
                                        .imageUrl(prd.getProductDetail().getProduct().getProductImages().getFirst().getImageUrl())
                                        .status(prd.getQuantity() > 0 || prd.getProductDetail().getStatus() == ProductStatus.ACTIVE || prd.getProductDetail().getProduct().getStatus() == ProductStatus.ACTIVE)
                                        .quantity(prd.getQuantity())
                                        .retailPrice(prd.getRetailPrice())
                                        .discountPrice(prd.getDiscountAmount())
                                        .totalAmount(prd.getTotalAmountProduct())
                                        .build()
                        ).toList())
                        .paymentMethod(i.getPaymentMethod())
                        .build()
        ).toList();

        return PageableResponse.builder()
                .content(invoices)
                .build();
    }
}
