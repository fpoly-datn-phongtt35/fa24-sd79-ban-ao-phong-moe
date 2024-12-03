package sd79.model.redis_model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;
import sd79.enums.ProductStatus;
import sd79.model.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RedisHash("favouriteProduct")
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavouriteProduct {

    @Id
    @Indexed
    private Long id;

    private String name;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @ColumnDefault("'ACTIVE'")
    @Column(name = "status")
    private ProductStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "material_id")
    private Material material;

    @Column(name = "origin", length = 30)
    private String origin;

    @OneToMany(mappedBy = "product")
    private List<ProductDetail> productDetails = new ArrayList<>();


    @OneToMany(mappedBy = "product")
    private List<ProductImage> productImages = new ArrayList<>();


}
