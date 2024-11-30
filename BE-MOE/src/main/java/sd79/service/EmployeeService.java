package sd79.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sd79.dto.requests.EmployeeReq;
import sd79.dto.requests.EmployeeRequest;
import sd79.dto.requests.employees.EmployeeImageReq;
import sd79.dto.requests.employees.PasswordUpdateRequest;
import sd79.dto.response.EmployeeResponse;
import sd79.model.Employee;



import java.util.List;

public interface EmployeeService {
    void updatePassword(PasswordUpdateRequest request, long id);

    EmployeeResponse getEmployeeById(Long id);

    void deleteEmployee(Long id);

    Page<EmployeeResponse> getEmployee(Pageable pageable);

    int storeEmployee(EmployeeReq req);

    void setUserLocked(long id,Boolean isLocked);

    void updateEmp(EmployeeReq req, Long id);

    List<EmployeeResponse> findByNameAndPhone(String keyword, String phone_number);

    void updateImage(EmployeeImageReq req);

    EmployeeResponse detailByUserId(long userId);

    EmployeeResponse updateByUserId(long userId, EmployeeRequest request);

}
