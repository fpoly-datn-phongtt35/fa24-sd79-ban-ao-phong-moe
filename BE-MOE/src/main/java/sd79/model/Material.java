package sd79.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.io.Serializable;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "materials")
public class Material  extends AbstractEntity<Integer> implements Serializable {
    @Size(max = 50)
    @Column(name = "name", length = 50)
    private String name;
}