package sd79.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeResponse {
    private Integer id;

    private String first_name;

    private String last_name;

    private String phone_number;

    private String gender;

    private Date date_of_birth;

    private String avatar;

    private Integer salaries;

    private String employee_address;

    private String position;
}
