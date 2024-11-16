package sd79.dto.response.clients.customer;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Builder
@Getter
public class UserAddressInfoRes {

    private String firstName;

    private String lastName;

    private String fullName;

    private String city;

    private int city_id;

    private String district;

    private int district_id;

    private String ward;

    private String streetName;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private Date updatedAt;
}
