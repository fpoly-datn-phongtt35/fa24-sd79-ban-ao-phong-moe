package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.EmployeeReq;
import sd79.dto.response.EmployeeResponse;
import sd79.dto.response.employees.PositionResponse;
import sd79.enums.Gender;
import sd79.exception.EntityNotFoundException;
import sd79.model.*;
import sd79.repositories.*;
import sd79.repositories.auth.RoleRepository;
import sd79.repositories.auth.UserRepository;
import sd79.service.EmployeeService;
import sd79.utils.CloudinaryUtils;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    private final PositionsRepository positionsRepository;

    private final SalaryRepository salaryRepository;

    private final Employee_addressRepository addressRepository;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final CloudinaryUtils cloudinary;

    @Override
    public EmployeeResponse getEmployeeById(Integer id) {
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

//    @Override
//    public int storeEmployee(EmployeeReq req) {
//        Salary salary = this.salaryRepository.save(Salary.builder().amount(req.getSalary()).build());

//        EmployeeAddress address = new EmployeeAddress();
//        address.setWardId(req.getAddress().getWardId());
//        address.setWard(req.getAddress().getWard());
//        address.setDistrictId(req.getAddress().getDistrictId());
//        address.setDistrict(req.getAddress().getDistrict());
//        address.setProvince(req.getAddress().getProvince());
//        address.setProvinceId(req.getAddress().getProvinceId());
//        addressRepository.save(address);
//        System.out.println(address.getProvince()+"gi do");
//
//        Employee employee = Employee.builder()
//                .first_name(req.getFirst_name())
//                .last_name(req.getLast_name())
//                .phone_number(req.getPhone_number())
//                .gender(req.getGender())
//                .date_of_birth(req.getDate_of_birth())
//                .avatar(req.getAvatar())
//                .position(getPositionById(req.getPositionId()))
//                .salaries(salary)
//                .employee_address(address)
//                .build();
//        return this.employeeRepository.save(employee).getId();
//    }

    @Override
    public int storeEmployee(EmployeeReq req) {
        User user = this.userRepository.save(User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(this.roleRepository.findById(1).orElseThrow(() -> new EntityNotFoundException("Role not found")))
                .isDeleted(false)
                .isLocked(false)
                .isEnabled(false)
                .createdAt(new Date())
                .updatedAt(new Date())
                .isDeleted(false)
                .build());
        Salary salary = this.salaryRepository.save(Salary.builder().amount(req.getSalary()).build());
        EmployeeAddress address = this.addressRepository.save(EmployeeAddress.builder()
                .streetName(req.getAddress().getStreetName())
                .ward(req.getAddress().getWard())
                .wardId(req.getAddress().getWardId())
                .district(req.getAddress().getDistrict())
                .districtId(req.getAddress().getDistrictId())
                .province(req.getAddress().getProvince())
                .provinceId(req.getAddress().getProvinceId())
                .build());

        Positions position = this.positionsRepository.findById(req.getPositionId()).orElseThrow(() -> new EntityNotFoundException("Position not found"));
        return this.employeeRepository.save(Employee.builder()
                .first_name(req.getFirst_name())
                .last_name(req.getLast_name())
                .phone_number(req.getPhone_number())
                .gender(req.getGender())
                .date_of_birth(req.getDate_of_birth())
                .salaries(salary)
                .employee_address(address)
                .position(position)
                .user(user)
                .build()).getId();
    }


    @Override
    public void updateEmp(EmployeeReq req, Integer id) {
        System.out.println(req.getPositionId());
        Employee employee = this.employeeRepository.findByIdEmp(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên với ID: " + id));
        System.out.println(employee.getFirst_name());

        Salary salary = this.salaryRepository.findById(employee.getSalaries().getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin lương cho nhân viên"));

        // Kiểm tra giá trị salary trong req
        System.out.println("Salary từ request: " + req.getSalary());

        // Cập nhật thông tin lương
        salary.setAmount(req.getSalary());
        System.out.println("Updated salary: " + salary.getAmount());
        this.salaryRepository.save(salary);

        // Cập nhật địa chỉ
//    Employee_address address = this.addressRepository.findById(req.getAddress().getId())
//            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy địa chỉ với ID: " + req.getAddress().getId()));

        // Cập nhật thông tin địa chỉ
//    address.setProvince(req.getAddress().getProvince());
//    address.setDistrict(req.getAddress().getDistrict());
//    address.setWard(req.getAddress().getWard());
        // Thêm các trường khác nếu cần
//    this.addressRepository.save(address); // Lưu địa chỉ đã cập nhật

        // Cập nhật các thông tin khác của nhân viên
        employee.setFirst_name(req.getFirst_name());
        employee.setLast_name(req.getLast_name());
        employee.setPhone_number(req.getPhone_number());
//        employee.setGender(req.getGender());
        employee.setDate_of_birth(req.getDate_of_birth());
//        employee.setAvatar(req.getAvatar());
        employee.setPosition(getPositionById(req.getPositionId()));
        employee.setSalaries(salary);
//    employee.setEmployee_address(address); // Liên kết địa chỉ đã cập nhật với nhân viên

        this.employeeRepository.save(employee); // Lưu nhân viên vào cơ sở dữ liệu
    }


    @Override
    public List<Employee> findByNameAndPhone(String keyword, String phone_number) {
        return employeeRepository.findByKeywordAndPhone(keyword, phone_number);
    }

    Positions getPositionById(int id) {
        return this.positionsRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Position not found!"));
    }


    private EmployeeResponse convertEmployeeResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .first_name(employee.getFirst_name())
                .last_name(employee.getLast_name())
                .phone_number(employee.getPhone_number())
                .gender(employee.getGender() == Gender.MALE ? "Nam" : employee.getGender() == Gender.FEMALE ? "Nữ" : "Khác")
                .date_of_birth(employee.getDate_of_birth())
//                .avatar(employee.getAvatar())
                .salaries(employee.getSalaries().getAmount())
                .employee_address(employee.getEmployee_address())
                .position(PositionResponse.builder()
                        .id(employee.getPosition().getId())
                        .name(employee.getPosition().getName())
                        .build())
                .build();
    }
}
