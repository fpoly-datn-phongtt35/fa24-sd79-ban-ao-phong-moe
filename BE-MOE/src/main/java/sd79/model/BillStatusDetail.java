package sd79.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "bill_status_detail")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillStatusDetail extends AbstractEntity<Long> implements Serializable {

    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "bill_id")
    private Bill bill;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bill_status_id")
    private BillStatus billStatus;

    @Column(name = "note")
    private String note;

}