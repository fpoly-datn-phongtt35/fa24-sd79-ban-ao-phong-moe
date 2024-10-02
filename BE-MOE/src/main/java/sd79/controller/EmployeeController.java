package sd79.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sd79.model.Employee;
import sd79.service.impl.EmployeeServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/${api.version}/employee")
public class EmployeeController {
    @Autowired
    EmployeeServiceImpl employeeService;
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployee();
    }
}
