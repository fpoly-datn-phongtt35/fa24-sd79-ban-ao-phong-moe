package sd79.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.*;
import sd79.dto.response.EmployeeResponse;
import sd79.dto.response.ResponseData;
import sd79.model.Employee;
import sd79.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/${api.version}/employee")
public class EmployeeController {
    @Autowired
    EmployeeService employeeService;

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployee();
    }
    @PostMapping
    public ResponseData<?> add(@RequestBody EmployeeResponse response){
        return new ResponseData<>(HttpStatus.OK.value(),"them thanh cong",employeeService.save(response));
    }
}
