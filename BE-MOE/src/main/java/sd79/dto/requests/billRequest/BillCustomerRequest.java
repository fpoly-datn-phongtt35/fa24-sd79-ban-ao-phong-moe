package sd79.dto.requests.billRequest;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BillCustomerRequest {
    @Size(max = 25)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Size(max = 20)
    private String phoneNumber;

    private String city;

    private int city_id;

    private String district;

    private int district_id;

    private String ward;

    private String streetName;

}
