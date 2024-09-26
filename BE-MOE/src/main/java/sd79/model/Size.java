package sd79.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "sizes")
public class Size {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @jakarta.validation.constraints.Size(max = 10)
    @Column(name = "name", length = 10)
    private String name;

    @Column(name = "length")
    private Float length;

    @Column(name = "withd")
    private Float withd;

    @Column(name = "sleeve")
    private Float sleeve;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "create_at")
    private Instant createAt;

    @Column(name = "update_at")
    private Instant updateAt;

    @ColumnDefault("b'0'")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

}