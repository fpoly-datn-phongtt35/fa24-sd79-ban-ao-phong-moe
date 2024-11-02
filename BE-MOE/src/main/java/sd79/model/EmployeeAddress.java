package sd79.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "employee_address")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @Column(name = "street_name", length = 50)
    private String streetName;

    @Size(max = 50)
    @Column(name = "ward", length = 50)
    private String ward;

    @Size(max = 50)
    @Column(name = "district", length = 50)
    private String district;

    @Column(name = "district_id")
    private Integer districtId;

    @Size(max = 50)
    @Column(name = "province", length = 50)
    private String province;

    @Column(name = "province_id")
    private Integer provinceId;

}