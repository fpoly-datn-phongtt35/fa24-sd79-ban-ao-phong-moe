package sd79.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import sd79.enums.PaymentMethod;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "bill")
public class Bill extends AbstractEntity<Long> implements Serializable {

    @Size(max = 10)
    @Column(name = "code", length = 10)
    private String code;

    @Size(max = 255)
    @Column(name = "bank_code")
    private String bankCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bill_status_id")
    private BillStatus billStatus;

    @Column(name = "shipping", precision = 15)
    private BigDecimal shipping;

    @Column(name = "subtotal", precision = 15)
    private BigDecimal subtotal;

    @Column(name = "seller_discount", precision = 15)
    private BigDecimal sellerDiscount;

    @Column(name = "total", precision = 15)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Size(max = 255)
    @Column(name = "message")
    private String message;

    @Size(max = 255)
    @Column(name = "note")
    private String note;

    @Column(name = "payment_time")
    private Date paymentTime;

    @OneToMany(mappedBy = "bill")
    private Set<BillDetail> billDetails = new LinkedHashSet<>();

}