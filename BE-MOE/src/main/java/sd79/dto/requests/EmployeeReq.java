package sd79.dto.requests;

import lombok.Builder;
import lombok.Getter;
import sd79.model.Employee_address;

import java.util.Date;

@Getter
@Builder
public class EmployeeReq {

    private String first_name;

    private String last_name;

    private String phone_number;

    private String gender;

    private Date date_of_birth;

    private String avatar;

    private int salary;

    private int positionId;

    private Employee_address address;
}
