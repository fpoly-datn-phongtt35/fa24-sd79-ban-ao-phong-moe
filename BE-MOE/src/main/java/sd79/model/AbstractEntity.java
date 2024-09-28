package sd79.model;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@MappedSuperclass
public abstract class AbstractEntity<T extends Serializable> implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private T id;

    @JoinColumn(name = "created_by")
    @ManyToOne(fetch = FetchType.EAGER)
    private User createdBy;

    @JoinColumn(name = "updated_by")
    @ManyToOne(fetch = FetchType.EAGER)
    private User updatedBy;

    @Column(name = "create_at")
    @CreationTimestamp
    private Date createAt;

    @Column(name = "update_at")
    @UpdateTimestamp
    private Date updateAt;

    @Column(name = "is_deleted")
    private Boolean isDeleted = Boolean.FALSE;
}
