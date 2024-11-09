/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.response.clients.invoices;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import sd79.enums.InvoiceStatus;
import sd79.enums.PaymentMethod;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public abstract class InvoiceResponse {

    @Builder
    @Getter
    @Setter
    public static class Param {
        private Integer pageNo = 1;

        private Integer pageSize = 5;

        private String keyword;

        private Integer status;

        private Long userId;
    }

    @Builder
    @Getter
    public static class Invoice {
        private Long id;

        private String code;

        private int quantity;

        private BigDecimal subtotal;

        private BigDecimal sellDiscount;

        private BigDecimal shippingFee;

        private BigDecimal totalAmount;

        private InvoiceStatus status;

        private Date paymentTime;

        private Date orderDate;

        private PaymentMethod paymentMethod;

        private List<Product> products;
    }

    @Builder
    @Getter
    public static class Product {
        private Long id; // id product detail

        private String name;

        private String imageUrl;

        private boolean status;

        private int quantity;

        private BigDecimal retailPrice;

        private BigDecimal discountPrice;

        private BigDecimal totalAmount;
    }

    @Builder
    @Getter
    public static class InvoiceStatus {
        private Integer id;

        private String name;

        private sd79.enums.InvoiceStatus status;
    }
}
