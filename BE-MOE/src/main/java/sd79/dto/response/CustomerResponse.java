package sd79.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Builder
@Setter
public class CustomerResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private String phoneNumber;
    private String email;
//    private String password;
    private String gender;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private Date dateOfBirth;
    private String image;
    private String city;
    private String district;
    private String ward;
    private String streetName;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private Date createdAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private Date updatedAt;


}
