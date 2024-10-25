package sd79.dto.requests.productRequests;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;
@Getter
@Builder
public class CustomerRequest {
    @Size(max = 25)
    @NotEmpty(message = "Tên không được để trống")
    private String firstName;

    @Size(max = 50)
    @NotEmpty(message = "Họ không được để trống")
    private String lastName;

    @Size(max = 20)
    @NotEmpty(message = "Số điện thoại không được để trống")
    private String phoneNumber;


    @NotEmpty(message = "Giới tính không được để trống")
    private String gender;

    @NotNull(message = "Không được để trống ngày sinh")
    private Date dateOfBirth;


    private String city;


    private String district;


    private String ward;


    private String streetName;

    @NotEmpty(message = "Email không được để trống")
    private String email;
}
