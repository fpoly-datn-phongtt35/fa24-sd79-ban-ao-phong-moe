package sd79.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import sd79.enums.TodoDiscountType;
import sd79.enums.TodoType;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "coupons")
public class Coupon extends AbstractEntity<Long> implements Serializable {

    @Size(max = 10)
    @Column(name = "code", length = 10)
    private String code;

    @Size(max = 100)
    @NotNull
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type")
    private TodoDiscountType discountType;

    @Column(name = "discount_value", precision = 15)
    private BigDecimal discountValue;

    @Column(name = "max_value", precision = 15)
    private BigDecimal maxValue;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "conditions", precision = 15)
    private BigDecimal conditions;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TodoType type;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "description")
    private String description;

    public String getStatus() {
        Date currentDate = new Date();

        if (startDate != null && endDate != null) {
            if (currentDate.before(startDate)) {
                return "Not Started";  // chưa diễn ra
            } else if (currentDate.after(endDate)) {
                return "Ended";  // kết thúc
            } else {
                return "Ongoing";  // đang diễn ra
            }
        }
        return "Invalid Date";
    }
}
