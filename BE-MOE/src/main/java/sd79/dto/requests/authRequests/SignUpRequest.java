/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.dto.requests.authRequests;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;
import sd79.dto.validator.EnumPattern;
import sd79.enums.Gender;

import java.util.Date;

@Getter
@Builder
public class SignUpRequest {

    @Length(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @NotBlank(message = "Username must not be null or empty")
    private String username;

    @Email(message = "Email must be in a valid format")
    @NotBlank(message = "Email must not be null or empty")
    private String email;

    @NotBlank(message = "Password must not be null or empty")
    @Length(min = 6, max = 50, message = "Password must be between 8 and 50 characters")
    private String password;

    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @NotNull(message = "Gender must not be null")
    @EnumPattern(name = "status", regexp = "MALE|FEMALE|OTHER", message = "gender invalid format!")
    private Gender gender;

    @NotNull(message = "Date of birth must not be null")
    private Date dateOfBirth;

    @NotBlank(message = "Phone number must not be null or empty")
    @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Phone number must be valid and contain between 7 and 15 digits")
    private String phoneNumber;

    @NotNull(message = "Street Name cannot be null")
    private String streetName;

    @NotNull(message = "Ward cannot be null")
    private String ward;

    @NotNull(message = "District cannot be null")
    private String district;

    @Positive(message = "District ID must be a positive number")
    private Integer districtId;

    @NotNull(message = "City cannot be null")
    private String city;

    @Positive(message = "City ID must be a positive number")
    private Integer cityId;

    private MultipartFile avatar;
}
