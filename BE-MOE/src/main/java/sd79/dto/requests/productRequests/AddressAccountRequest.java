package sd79.dto.requests.productRequests;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AddressAccountRequest {
    private String city;

    private int city_id;

    private String district;

    private int district_id;

    private String ward;

    private String streetName;
}
