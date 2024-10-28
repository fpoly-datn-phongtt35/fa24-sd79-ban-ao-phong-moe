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
    @NotEmpty(message = "FirstName cannot be empty")
    private String firstName;

    @Size(max = 50)
    @NotEmpty(message = "LastName cannot be empty")
    private String lastName;

    @Size(max = 20)
    @NotEmpty(message = "PhoneNumber cannot be empty")
    private String phoneNumber;


    @NotEmpty(message = "Gender cannot be empty")
    private String gender;

    @NotNull(message = "DateOfBirth cannot be null")
    private Date dateOfBirth;


//    @NotEmpty(message = "Image cannot be empty")
//    private MultipartFile image;

//    @NotEmpty(message = "City cannot be empty")
    private String city;

//    @NotEmpty(message = "District cannot be empty")
    private String district;

//    @NotEmpty(message = "Ward cannot be empty")
    private String ward;

//    @NotEmpty(message = "StreetName cannot be empty")
    private String streetName;

    @NotEmpty(message = "Email cannot be empty")
    private String email;

    @NotEmpty(message = "UserName cannot be empty")
    private String username;

    @NotEmpty(message = "Password cannot be empty")
    private String password;
}
