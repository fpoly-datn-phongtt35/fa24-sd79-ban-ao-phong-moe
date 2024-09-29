package sd79.dto.requests;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Builder
public class CustomerReq {

    @Size(max = 25)
    @NotNull(message = "FistName cannot be null")
    @NotEmpty(message = "FirstName cannot be empty")
    private String firstName;

    @Size(max = 50)
    @NotNull(message = "LastName cannot be null")
    @NotEmpty(message = "LastName cannot be empty")
    private String lastName;

    @Size(max = 20)
    @NotNull(message = "PhoneNumber cannot be null")
    @NotEmpty(message = "PhoneNumber cannot be empty")
    private String phoneNumber;

    @Lob
    @NotNull(message = "Gender cannot be null")
    @NotEmpty(message = "Gender cannot be empty")
    private String gender;

    @NotNull(message = "DateOfBirth cannot be null")
    @NotEmpty(message = "DateOfBirth cannot be empty")
    private LocalDate dateOfBirth;


    @NotNull(message = "Image cannot be null")
    @NotEmpty(message = "Image cannot be empty")
    private String image;


    private Date createdAt;


    private Date updatedAt;
}
