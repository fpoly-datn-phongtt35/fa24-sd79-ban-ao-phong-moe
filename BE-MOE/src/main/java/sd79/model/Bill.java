package sd79.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "bill")
public class Bill extends AbstractEntity<Long> implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 10)
    @Column(name = "code", length = 10)
    private String code;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    @ManyToOne
    @JoinColumn(name = "bill_status_id")
    private BillStatus billStatus;

    @Column(name = "shipping_cost", precision = 15)
    private BigDecimal shippingCost;

    @Column(name = "total_amount", precision = 15)
    private BigDecimal totalAmount;

    @Size(max = 255)
    @Column(name = "barcode")
    private String barcode;

    @Size(max = 255)
    @Column(name = "qr_code")
    private String qrCode;

}