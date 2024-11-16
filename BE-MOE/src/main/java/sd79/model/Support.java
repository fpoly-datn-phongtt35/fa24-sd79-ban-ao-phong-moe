package sd79.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "support")
public class Support {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @JoinColumn(name = "issue_description")
    private String issueDescription;

    @JoinColumn(name = "status")
    private String status;

    @JoinColumn(name = "created_date")
    private LocalDateTime createdDate;

    @JoinColumn(name = "resolved_date")
    private LocalDateTime resolvedDate;
}
