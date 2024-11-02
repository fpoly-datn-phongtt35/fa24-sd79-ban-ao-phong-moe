package sd79.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "customer_address")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @Column(name = "street_name")
    private String streetName;

    @Size(max = 255)
    @Column(name = "ward")
    private String ward;

    @Size(max = 255)
    @Column(name = "district")
    private String district;

    @Size(max = 255)
    @Column(name = "city")
    private String city;

//    @Column(name = "ward_id")
//    private Integer wardId;

    @Column(name = "district_id")
    private Integer districtId;

    @Column(name = "city_id")
    private Integer cityId;

}