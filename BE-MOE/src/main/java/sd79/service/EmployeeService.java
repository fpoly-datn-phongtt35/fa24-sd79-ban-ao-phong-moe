package sd79.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sd79.dto.requests.EmployeeReq;
import sd79.dto.response.EmployeeResponse;
import sd79.model.Employee;



import java.util.List;

public interface EmployeeService {
    List<EmployeeResponse> getEmployee();
    EmployeeResponse getEmployeeById(Integer id);
//    long createEmployee(EmployeeRequest employeeRequest);
//    long updateEmployee(Integer id, EmployeeRequest employeeRequest);
    void deleteEmployee(Integer id);
    Page<EmployeeResponse> getEmployee(Pageable pageable);
    int storeEmployee(EmployeeReq req);
    void updateEmp(EmployeeReq req, Integer id);
    List<Employee> findByNameAndPhone(String keyword, String phone_number);
}
