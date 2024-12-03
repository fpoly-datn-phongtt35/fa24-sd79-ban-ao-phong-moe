package sd79.dto.requests;

import lombok.Builder;
import lombok.Getter;
import sd79.enums.Gender;

import java.util.Date;
@Getter
@Builder
public class EmployeeRequest {

    private String email;

    private String first_name;

    private String last_name;

    private String phone_number;

    private Gender gender;

    private Date date_of_birth;

    private String avatar;

    private String city;

    private int city_id;

    private String district;

    private int district_id;

    private String ward;

    private String streetName;
}
