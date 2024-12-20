package sd79.service.impl;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.EmployeeReq;
import sd79.dto.requests.EmployeeRequest;
import sd79.dto.requests.employees.EmployeeImageReq;
import sd79.dto.requests.employees.PasswordUpdateRequest;
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
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        return convertEmployeeResponse(employee);
    }

    @Transactional
    @Override
    public void deleteEmployee(Long id) { //xoá nhân viên
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
        if (this.employeeRepository.existsByUsername(req.getUsername())) {
            throw new EntityExistsException("Tên tài khoản đã tồn tại.");
        } else if (this.employeeRepository.existsByEmail(req.getEmail())) {
            throw new EntityExistsException("Email đã tồn tại.");
        } else if (this.employeeRepository.existsByPhoneNumber(req.getPhone_number())) {
            throw new EntityExistsException("Số điện thoại đã tồn tại.");
        }
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
                .streetName(req.getStreetName())
                .ward(req.getWard())
                .district(req.getDistrict())
                .districtId(req.getDistrict_id())
                .city(req.getCity())
                .cityId(req.getCity_id())
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
    public void setUserLocked(long id, Boolean isLocked) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên"));
        User user = userRepository.findById(employee.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin người dùng"));
        user.setIsLocked(isLocked);
        this.userRepository.save(user);
    }


    @Override
    public void updateEmp(EmployeeReq req, Long id) {

        Employee employee = this.employeeRepository.findByIdEmp(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên với ID: " + id));

        EmployeeAddress address = employee.getEmployee_address();
        if (address == null) {
            address = new EmployeeAddress();
        }
        // Tìm và cập nhật lương
        Salary salary = this.salaryRepository.findById(employee.getSalaries().getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin lương cho nhân viên"));
        salary.setAmount(req.getSalary());
        this.salaryRepository.save(salary);

        // Tìm và cập nhật thông tin người dùng
        User user = this.userRepository.findById(employee.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin user"));
        user.setEmail(req.getEmail());
        this.userRepository.save(user); // Lưu riêng đối tượng User trước khi gán vào Employee

        address.setCity(req.getCity());
        address.setCityId(req.getCity_id());
        address.setDistrict(req.getDistrict());
        address.setDistrictId(req.getDistrict_id());
        address.setWard(req.getWard());
        address.setStreetName(req.getStreetName());
        address = addressRepository.save(address);
        // Cập nhật các thông tin khác của nhân viên
        employee.setFirst_name(req.getFirst_name());
        employee.setLast_name(req.getLast_name());
        employee.setPhone_number(req.getPhone_number());
        employee.setGender(req.getGender());
        employee.setDate_of_birth(req.getDate_of_birth());
        employee.setPosition(getPositionById(req.getPosition()));
        employee.setSalaries(salary);
        employee.setEmployee_address(address);
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

    @Override
    public EmployeeResponse detailByUserId(long userId) {
        // Tìm thông tin người dùng dựa trên userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin người dùng với userId: " + userId));

        // Tìm thông tin nhân viên liên kết với user
        Employee employee = employeeRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin nhân viên với userId: " + userId));

        // Chuyển đổi đối tượng Employee sang EmployeeResponse
        return convertEmployeeResponse(employee);
    }

    @Override
    public void updateByUserId(long userId, EmployeeReq request) {

        // Tìm thông tin người dùng dựa trên userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin người dùng với userId: " + userId));
        user.setEmail(request.getEmail());
        // Tìm thông tin nhân viên liên kết với user
        Employee employee = employeeRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin nhân viên với userId: " + userId));

        EmployeeAddress address = employee.getEmployee_address();
        if (address == null) {
            address = new EmployeeAddress();
        }
        address.setCity(request.getCity());
        address.setCityId(request.getCity_id());
        address.setDistrict(request.getDistrict());
        address.setDistrictId(request.getDistrict_id());
        address.setWard(request.getWard());
        address.setStreetName(request.getStreetName());
        address = addressRepository.save(address);
        // Cập nhật thông tin nhân viên
        employee.setFirst_name(request.getFirst_name());
        employee.setLast_name(request.getLast_name());
        employee.setPhone_number(request.getPhone_number());
        employee.setGender(request.getGender());
        employee.setDate_of_birth(request.getDate_of_birth());
        employee.setEmployee_address(address);
        // Lưu thông tin
        this.employeeRepository.save(employee);
        userRepository.save(user);
    }

    @Override
    public void updatePassword(PasswordUpdateRequest request, long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin người dùng"));
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không đúng");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(new Date());
        userRepository.save(user);
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
