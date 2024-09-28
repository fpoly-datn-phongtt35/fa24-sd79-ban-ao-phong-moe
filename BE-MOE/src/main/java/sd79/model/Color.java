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
@Table(name = "colors")
public class Color  extends AbstractEntity<Integer> implements Serializable {
    @Column(name = "name", length = 10)
    private String name;

    @Column(name = "hex_color_code", length = 100)
    private String hexColorCode;
}