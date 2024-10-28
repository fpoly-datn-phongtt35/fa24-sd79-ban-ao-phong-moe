package sd79.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import sd79.enums.Gender;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "first_name")
    private String first_name;

    @Column(name = "last_name")
    private String last_name;

    @Column(name = "phone_number")
    private String phone_number;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "date_of_birth")
    private Date date_of_birth;

    @Size(max = 200)
    @Column(name = "image", length = 200)
    private String image;

    @Size(max = 200)
    @Column(name = "publicId", length = 200)
    private String publicId;

    @Column(name = "created_at")
    @CreationTimestamp
    private Date createAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Date updateAt;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "salary_id")
    private Salary salaries;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private EmployeeAddress employee_address;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private Positions position;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;
}
