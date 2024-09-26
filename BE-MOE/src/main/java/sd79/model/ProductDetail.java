package sd79.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "product_details")
public class ProductDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private sd79.model.Product product;

    @Column(name = "retail_price", precision = 15)
    private BigDecimal retailPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "size_id")
    private sd79.model.Size size;

    @Column(name = "color_image_id")
    private Long colorImageId;

    @Column(name = "quantity")
    private Integer quantity;

    @Lob
    @Column(name = "status")
    private String status;

}