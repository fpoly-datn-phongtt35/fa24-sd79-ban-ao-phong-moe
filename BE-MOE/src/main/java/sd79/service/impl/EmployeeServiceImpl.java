package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.EmployeeReq;

import sd79.dto.response.EmployeeResponse;
import sd79.exception.EntityNotFoundException;
import sd79.model.*;
import sd79.repositories.*;
import sd79.repositories.auth.UserRepository;
import sd79.service.EmployeeService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    private final PositionsRepository positionsRepository;

    private final SalaryRepository salaryRepository;

    private final Employee_addressRepository addressRepository;

    private final UserRepository userRepository;

//    @Override
//    public List<EmployeeResponse> getEmployee() { //tra ra danh sách nhân viên
//        return employeeRepository.findAll().stream().map(this::convertEmployeeResponse).toList();
//    }

    @Override
    public EmployeeResponse getEmployeeById(Integer id) { // tìm kiếm nhân viên theo ID
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        return convertEmployeeResponse(employee);
    }

    @Transactional
    @Override
    public void deleteEmployee(Integer id) { //xoá nhân viên
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        employeeRepository.delete(employee);
    }

    @Override
    public Page<EmployeeResponse> getEmployee(Pageable pageable) {
        return employeeRepository.findAll(pageable).map(this::convertEmployeeResponse);
    }

    @Override
    public int storeEmployee(EmployeeReq req) {
        Salary salary = this.salaryRepository.save(Salary.builder().amount(req.getSalary()).build());
//        Employee_address address = this.addressRepository.save(Employee_address.builder().city(req.getCity()).build());
        Employee_address address =req.getAddress();
        addressRepository.save(address);
        Employee employee = Employee.builder()
                .first_name(req.getFirst_name())
                .last_name(req.getLast_name())
                .phone_number(req.getPhone_number())
                .gender(req.getGender())
                .date_of_birth(req.getDate_of_birth())
                .avatar(req.getAvatar())
                .position(getPositionById(req.getPositionId()))
                .salaries(salary)
                .employee_address(address)
                .build();
        return this.employeeRepository.save(employee).getId();
    }

//    @Override
//    public void updateEmp(EmployeeReq req, Integer id) {
//        System.out.println(id);
//        Employee employee = this.employeeRepository.findByIdEmp(id).orElseThrow(() -> new EntityNotFoundException("Con cho an kit"));
//        System.out.println(employee.getFirst_name());
//        Salary salary = this.salaryRepository.findById(employee.getSalaries().getId()).orElseThrow(() -> new EntityNotFoundException("Con cho khong nhan luong"));
//        salary.setAmount(req.getSalary());
//        this.salaryRepository.save(salary);
//
//        Employee_address address =req.getAddress();
//        addressRepository.save(address);
//        this.addressRepository.save(address);
//
//        employee.setFirst_name(req.getFirst_name());
//        employee.setLast_name(req.getLast_name());
//        employee.setPhone_number(req.getPhone_number());
//        employee.setGender(req.getGender());
//        employee.setDate_of_birth(req.getDate_of_birth());
//        employee.setAvatar(req.getAvatar());
//        employee.setPosition(getPositionById(req.getPositionId()));
//        employee.setSalaries(salary);
//        employee.setEmployee_address(address);
//
//        this.employeeRepository.save(employee);
//    }
@Override
public void updateEmp(EmployeeReq req, Integer id) {
    System.out.println(id);
    Employee employee = this.employeeRepository.findByIdEmp(id)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên với ID: " + id));
    System.out.println(employee.getFirst_name());

    Salary salary = this.salaryRepository.findById(employee.getSalaries().getId())
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin lương cho nhân viên"));

    // Cập nhật thông tin lương
    salary.setAmount(req.getSalary());
    this.salaryRepository.save(salary);

    // Cập nhật địa chỉ
    Employee_address address = this.addressRepository.findById(req.getAddress().getId())
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy địa chỉ với ID: " + req.getAddress().getId()));

    // Cập nhật thông tin địa chỉ
    address.setProvince(req.getAddress().getProvince());
    address.setDistrict(req.getAddress().getDistrict());
    address.setWard(req.getAddress().getWard());
    // Thêm các trường khác nếu cần
    this.addressRepository.save(address); // Lưu địa chỉ đã cập nhật

    // Cập nhật các thông tin khác của nhân viên
    employee.setFirst_name(req.getFirst_name());
    employee.setLast_name(req.getLast_name());
    employee.setPhone_number(req.getPhone_number());
    employee.setGender(req.getGender());
    employee.setDate_of_birth(req.getDate_of_birth());
    employee.setAvatar(req.getAvatar());
    employee.setPosition(getPositionById(req.getPositionId()));
    employee.setSalaries(salary);
    employee.setEmployee_address(address); // Liên kết địa chỉ đã cập nhật với nhân viên

    this.employeeRepository.save(employee); // Lưu nhân viên vào cơ sở dữ liệu
}


    @Override
    public List<Employee> findByNameAndPhone(String keyword, String phone_number) {
        return employeeRepository.findByKeywordAndPhone(keyword, phone_number);
    }

    Positions getPositionById(int id){
        return this.positionsRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Position not found!"));
    }

//    private void populateEmployeeData(Employee employee, EmployeeRequest employeeRequest) {
//        // Check and set position
//        Positions positions = new Positions();
//        positions.setName(employeeRequest.getPosition());
//        employee.setPosition(positions);
//
//        // Check and set salary
//        Salary salary = new Salary();
//        salary.setAmount(employeeRequest.getSalaries());
//        employee.setSalaries(salary);
//
//        // Check and set address
//        Employee_address employee_address = new Employee_address();
//        employee_address.setCity(employeeRequest.getCity());
//        employee.setEmployee_address(employee_address);
//
//        // Set other basic employee info
//        employee.setFirst_name(employeeRequest.getFirst_name());
//        employee.setLast_name(employeeRequest.getLast_name());
//        employee.setPhone_number(employeeRequest.getPhone_number());
//        employee.setGender(employeeRequest.getGender());
//        employee.setDate_of_birth(employeeRequest.getDate_of_birth());
////        employee.setAvatar(employeeRequest.getAvatar());
//    }

    private EmployeeResponse convertEmployeeResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .first_name(employee.getFirst_name())
                .last_name(employee.getLast_name())
                .phone_number(employee.getPhone_number())
                .gender(employee.getGender())
                .date_of_birth(employee.getDate_of_birth())
//                .avatar(employee.getAvatar())
                .salaries(employee.getSalaries().getAmount())
//                .employee_address(employee.getEmployee_address().getCity())
                .employee_address(employee.getEmployee_address())

                .position(employee.getPosition().getName())
                .build();
    }
}
