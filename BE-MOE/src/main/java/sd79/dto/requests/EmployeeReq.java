package sd79.dto.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import sd79.dto.requests.employees.AddressRequest;
import sd79.enums.Gender;

import java.util.Date;

@Getter
@Builder
public class EmployeeReq {

    private String username;

    private String password;

    private String email;

    private String first_name;

    private String last_name;

    private String phone_number;

    private Gender gender;

    private Date date_of_birth;

    private String avatar;

    private int salary;

    private int position;

    private AddressRequest address;
}
