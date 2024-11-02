package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.EmployeeReq;
import sd79.dto.requests.employees.EmployeeImageReq;
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

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

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
        userRepository.delete(employee.getUser());
    }

    @Override
    public Page<EmployeeResponse> getEmployee(Pageable pageable) {
        return employeeRepository.findAll(pageable).map(this::convertEmployeeResponse);
    }

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
                .district(req.getAddress().getDistrict())
                .districtId(req.getAddress().getDistrictId())
                .province(req.getAddress().getProvince())
                .provinceId(req.getAddress().getProvinceId())
                .build());

        System.out.println(req.getPosition());
        Positions position = this.positionsRepository.findById(req.getPosition()).orElseThrow(() -> new EntityNotFoundException("Position not found"));
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
        Employee employee = this.employeeRepository.findByIdEmp(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên với ID: " + id));

        // Tìm và cập nhật lương
        Salary salary = this.salaryRepository.findById(employee.getSalaries().getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin lương cho nhân viên"));
        salary.setAmount(req.getSalary());
        this.salaryRepository.save(salary);

        // Tìm và cập nhật thông tin người dùng
        User user = this.userRepository.findById(employee.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin user"));
        user.setIsLocked(req.getIsLocked());
        user.setEmail(req.getEmail());
        this.userRepository.save(user); // Lưu riêng đối tượng User trước khi gán vào Employee

        // Cập nhật các thông tin khác của nhân viên
        employee.setFirst_name(req.getFirst_name());
        employee.setLast_name(req.getLast_name());
        employee.setPhone_number(req.getPhone_number());
        employee.setGender(req.getGender());
        employee.setDate_of_birth(req.getDate_of_birth());
        employee.setPosition(getPositionById(req.getPosition()));
        employee.setSalaries(salary);
        employee.setUser(user); // Gán lại user đã cập nhật vào employee
        this.employeeRepository.save(employee); // Lưu lại employee sau khi cập nhật
    }



    @Override
    public List<EmployeeResponse> findByNameAndPhone(String keyword, String phone_number) {
        try {
            List<EmployeeResponse> list = new ArrayList<>();
            List<Employee> employeeList = employeeRepository.findByKeywordAndPhone(keyword, phone_number);
            for (Employee employee : employeeList) {
                EmployeeResponse employeeResponse = convertEmployeeResponse(employee);
                list.add(employeeResponse);
            }
            return list;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void updateImage(EmployeeImageReq req) {
        Employee employee = this.employeeRepository.findById(req.getProductId()).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên"));
        if (req.getImages() != null && employee.getPublicId() != null) {
            this.cloudinary.removeByPublicId(employee.getPublicId());
        }
        assert req.getImages() != null;
        Map<String, String> uploadResult = this.cloudinary.upload(req.getImages()[0]);
        employee.setImage(uploadResult.get("url"));
        employee.setPublicId(uploadResult.get("publicId"));
        employeeRepository.save(employee);
    }

    Positions getPositionById(int id) {
        return this.positionsRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Position not found!"));
    }


    private EmployeeResponse convertEmployeeResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .first_name(employee.getFirst_name())
                .last_name(employee.getLast_name())
                .full_name(String.format("%s %s", employee.getLast_name(), employee.getFirst_name()))
                .phone_number(employee.getPhone_number())
                .email(employee.getUser().getEmail())
                .isLocked(employee.getUser().getIsLocked())
                .gender(employee.getGender() == Gender.MALE ? "Nam" : employee.getGender() == Gender.FEMALE ? "Nữ" : "Khác")
                .date_of_birth(employee.getDate_of_birth())
                .avatar(employee.getImage())
                .salaries(employee.getSalaries().getAmount())
                .employee_address(employee.getEmployee_address())
                .position(PositionResponse.builder()
                        .id(employee.getPosition().getId())
                        .name(employee.getPosition().getName())
                        .build())
                .build();
    }
}
