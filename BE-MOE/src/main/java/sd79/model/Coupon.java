package sd79.model;

import com.example.utils.TodoDiscountType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import sd79.utils.TodoType;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

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

    @Column(name = "minimum_order_value", precision = 15)
    private BigDecimal minimumOrderValue;

    @Column(name = "quantity")
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TodoType type;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "description")
    private String description;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @ColumnDefault("b'0'")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

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
