package sd79.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sd79.dto.requests.EmployeeReq;
import sd79.dto.requests.employees.EmployeeImageReq;
import sd79.dto.response.EmployeeResponse;
import sd79.model.Employee;



import java.util.List;

public interface EmployeeService {

    EmployeeResponse getEmployeeById(Long id);

    void deleteEmployee(Long id);

    Page<EmployeeResponse> getEmployee(Pageable pageable);

    int storeEmployee(EmployeeReq req);

    void setUserLocked(long id,Boolean isLocked);

    void updateEmp(EmployeeReq req, Long id);

    List<EmployeeResponse> findByNameAndPhone(String keyword, String phone_number);

    void updateImage(EmployeeImageReq req);

    void updatePassword(String oldPassword, String newPassword, String confirmPassword, long id);
}
