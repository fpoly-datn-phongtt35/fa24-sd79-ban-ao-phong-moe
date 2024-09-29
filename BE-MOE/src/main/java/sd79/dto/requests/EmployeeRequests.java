package sd79.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeRequests {

    private Integer id;

    private String first_name;

    private String last_name;

    private String phone_number;

    private String gender;

    private LocalDate date_of_birth;

    private String avatar;

    private String salaries;

    private String employee_address;

    private String position;
}
