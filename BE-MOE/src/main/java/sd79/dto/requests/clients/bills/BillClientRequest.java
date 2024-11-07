/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.requests.clients.bills;

import lombok.Builder;
import lombok.Getter;
import sd79.enums.PaymentMethod;

import java.math.BigDecimal;
import java.util.List;

public abstract class BillClientRequest {

    @Builder
    @Getter
    public static class BillCreate{
        private String bankCode;

        private Long customerId;

        private Long couponId;

        private BigDecimal shipping;

        private BigDecimal subtotal;

        private BigDecimal sellerDiscount;

        private BigDecimal total;

        private PaymentMethod paymentMethod;

        private String message;

        private List<BillDetailCreate> items;
    }

    @Builder
    @Getter
    public static  class BillDetailCreate{
        private Long id;

        private BigDecimal retailPrice;

        private BigDecimal sellPrice;

        private int quantity;
    }
}
