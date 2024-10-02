package sd79.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sd79.model.Employee;
import sd79.repositories.EmployeeRepository;

import java.util.List;


@Service
@AllArgsConstructor
public class EmployeeServiceImpl {
    @Autowired
    private EmployeeRepository employeeRepo;

    public List<Employee> getAllEmployee() {
        return employeeRepo.findAll(); }

}
