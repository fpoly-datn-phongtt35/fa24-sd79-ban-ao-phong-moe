package sd79.dto.requests;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;


import java.util.Date;

@Getter
@Builder
public class CustomerReq {

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


//    @NotEmpty(message = "Image cannot be empty")
//    private MultipartFile image;

//    @NotEmpty(message = "City cannot be empty")
    private String city;

    private int city_id;

//    @NotEmpty(message = "District cannot be empty")
    private String district;

    private int district_id;

//    @NotEmpty(message = "Ward cannot be empty")
    private String ward;

//    private int ward_id;

//    @NotEmpty(message = "StreetName cannot be empty")
    private String streetName;

    @NotEmpty(message = "Email không được để trống")
    private String email;

    @NotEmpty(message = "Tên tài khoản không được để trống")
    private String username;

    @NotEmpty(message = "Mật khẩu không được để trống")
    private String password;
}
