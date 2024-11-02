package sd79.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sd79.dto.response.employees.PositionResponse;
import sd79.model.EmployeeAddress;


import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeResponse {
    private Integer id;

    private String first_name;

    private String last_name;

    private String full_name;

    private String phone_number;

    private String gender;

    private Date date_of_birth;

    private String avatar;

    private Integer salaries;

    private EmployeeAddress employee_address;

    private PositionResponse position;

    private String email;

    private Boolean isLocked;
}
