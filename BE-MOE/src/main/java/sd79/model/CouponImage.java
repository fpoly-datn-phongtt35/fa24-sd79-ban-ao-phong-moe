package sd79.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "coupon_images")
public class CouponImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToOne
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    @Size(max = 255)
    @Column(name = "image_url")
    private String imageUrl;

    @Size(max = 100)
    @Column(name = "public_id", length = 100)
    private String publicId;

}