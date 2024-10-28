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

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String first_name;

    @NotBlank
    private String last_name;

    @NotBlank
    private String phone_number;

    private Gender gender;

    @NotNull
    private Date date_of_birth;

    private String avatar;

    @NotNull
    private int salary;

    @NotNull
    private int positionId;

    @NotNull
    private AddressRequest address;
}
