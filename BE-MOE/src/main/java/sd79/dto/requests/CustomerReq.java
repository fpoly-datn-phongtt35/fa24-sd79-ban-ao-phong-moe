package sd79.dto.requests;

import com.fasterxml.jackson.annotation.JsonFormat;
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


    @NotEmpty(message = "Image cannot be empty")
    private String image;



}
