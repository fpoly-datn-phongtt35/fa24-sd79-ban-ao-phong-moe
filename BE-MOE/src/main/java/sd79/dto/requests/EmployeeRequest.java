package sd79.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeRequest {

    private String first_name;

    private String last_name;

    private String phone_number;

    private String gender;

    private Date date_of_birth;

    private String avatar;

    private Integer salaries;

    private String city;

    private String position;
}

