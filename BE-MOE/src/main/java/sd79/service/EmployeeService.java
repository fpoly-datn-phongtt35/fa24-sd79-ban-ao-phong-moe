package sd79.service;

import org.springframework.http.ResponseEntity;
import sd79.dto.response.EmployeeResponse;
import sd79.model.Employee;

import java.util.List;


public interface EmployeeService {
    List<Employee> getAllEmployee();

    ResponseEntity<?> save(EmployeeResponse employeeResponse);
}
