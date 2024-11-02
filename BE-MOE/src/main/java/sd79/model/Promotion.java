package sd79.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.util.*;

@Getter
@Setter
@Entity
@Table(name = "promotions")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Promotion extends AbstractEntity<Integer> implements Serializable {
    @Size(max = 255)
    @Column(name = "name")
    private String name;

    @Size(max = 20)
    @Column(name = "code", length = 20)
    private String code;

    @Column(name = "percent")
    private Integer percent;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Size(max = 255)
    @Column(name = "note")
    private String note;

    @OneToMany(mappedBy = "promotion")
    private List<PromotionDetail> promotionDetails = new ArrayList<>();

}