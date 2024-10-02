package sd79.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import sd79.enums.ProductStatus;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product  extends AbstractEntity<Long> implements Serializable {

    @Column(name = "name", length = 200)
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