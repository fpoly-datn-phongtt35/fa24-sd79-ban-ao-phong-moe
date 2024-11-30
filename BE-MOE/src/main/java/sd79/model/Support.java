package sd79.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "support")
public class Support {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "hoTen")
    private String hoTen;

    @Column(name = "email")
    private String email;

    @Column(name = "sdt")
    private String sdt;

    @Lob
    @Column(name = "issue_description")
    private String issueDescription;

    @Column(name = "status", length = 20)
    private Integer  status;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "resolved_date")
    private LocalDateTime resolvedDate;
}
