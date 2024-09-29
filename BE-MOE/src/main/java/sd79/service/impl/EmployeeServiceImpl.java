package sd79.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import sd79.dto.response.EmployeeResponse;
import sd79.model.Employee;
import sd79.model.Employee_address;
import sd79.model.Positions;
import sd79.model.Salary;
import sd79.repositories.EmployeeRepository;
import sd79.repositories.Employee_addressRepository;
import sd79.repositories.PositionsRepository;
import sd79.repositories.SalaryRepository;
import sd79.service.EmployeeService;

import java.time.Instant;
import java.util.List;


@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private Employee_addressRepository employee_addressRepo;

    @Autowired
    private PositionsRepository positionsRepo;

    @Autowired
    private SalaryRepository salaryRepo;

    @Override
    public List<Employee> getAllEmployee() {
        return employeeRepo.findAll();
    }

    @Override
    public ResponseEntity<?> save(EmployeeResponse response) {
        Employee employee =new Employee();
        employee.setFirst_name(response.getFirst_name());
        employee.setLast_name(response.getLast_name());
        employee.setPhone_number(response.getPhone_number());
        employee.setGender(response.getGender());
        employee.setDate_of_birth(response.getDate_of_birth());
        employee.setAvatar(response.getAvatar());
        employee.setCreateAt(Instant.now());
        employee.setUpdateAt(Instant.now());

        Salary salary= new Salary();
        salary.setAmount(Integer.parseInt(response.getSalaries()));
        salaryRepo.save(salary);

        Employee_address employee_address=new Employee_address();
        employee_address.setStreet_name(response.getEmployee_address());
        employee_address.setWard(response.getEmployee_address());
        employee_address.setDistrict(response.getEmployee_address());
        employee_address.setCity(response.getEmployee_address());
        employee_address.setCountry(response.getEmployee_address());
        employee_addressRepo.save(employee_address);

        Positions positions =new Positions();
        positions.setName(response.getPosition());
        positionsRepo.save(positions);

        employeeRepo.save(employee);
        return null;
    }


}
