package sd79.service.impl;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.CustomerReq;
import sd79.dto.requests.productRequests.CustomerRequest;
import sd79.dto.requests.productRequests.ProductImageReq;
import sd79.dto.response.CustomerResponse;
import sd79.dto.response.auth.UserResponse;
import sd79.enums.Gender;
import sd79.enums.ProductStatus;
import sd79.exception.EntityNotFoundException;
import sd79.model.Customer;
import sd79.model.CustomerAddress;
import sd79.model.Product;
import sd79.model.User;
import sd79.repositories.CustomerAddressRepository;
import sd79.repositories.CustomerRepository;
import sd79.repositories.auth.RoleRepository;
import sd79.repositories.auth.UserRepository;
import sd79.service.CustomerService;
import sd79.utils.CloudinaryUtils;

import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private static final String EMAIL_REGEX = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    private static final String USERNAME_REGEX = "^[A-Za-z0-9]{6,20}$";

    private static final String PASSWORD_REGEX = "^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{6,20}$";
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(PASSWORD_REGEX);

    private static final String PHONE_REGEX = "^0\\d{9,11}$";
    private static final Pattern PHONE_PATTERN = Pattern.compile(PHONE_REGEX);

    private static final Logger log = LoggerFactory.getLogger(CustomerServiceImpl.class);
    private final CustomerRepository customerRepository;
    private final CustomerAddressRepository customerAddressRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private final CloudinaryUtils cloudinary;

    @Override
    public Page<CustomerResponse> getAll(Pageable pageable) {  // Modified method to return a paginated response
        Page<Customer> customers = customerRepository.findAll(pageable);
        return customers.map(this::convertCustomerResponse);
    }


    @Override
    public void setUserLocked(long id, Boolean isLocked) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng"));
        User user = userRepository.findById(customer.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin người dùng"));
        user.setIsLocked(isLocked);
        this.userRepository.save(user);
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng"));
        return convertCustomerResponse(customer);
    }




    @Transactional
    @Override
    public long createCustomer(CustomerReq customerReq) {

//        if (this.customerRepository.existsByUsername(customerReq.getUsername())) {
//            throw new EntityExistsException("Tên tài khoản đã tồn tại.");
//        } else
            if (this.customerRepository.existsByEmail(customerReq.getEmail())) {
            throw new EntityExistsException("Email đã tồn tại.");
        } else if (this.customerRepository.existsByPhoneNumber(customerReq.getPhoneNumber())) {
            throw new EntityExistsException("Số điện thoại đã tồn tại.");
        }
        {


            CustomerAddress address = CustomerAddress.builder()
                    .city(customerReq.getCity())
                    .district(customerReq.getDistrict())
                    .ward(customerReq.getWard())
                    .streetName(customerReq.getStreetName())
                    .cityId(customerReq.getCity_id())
                    .districtId(customerReq.getDistrict_id())
                    .build();
            address = this.customerAddressRepository.save(address);

            User user = User.builder()
//                    .username(customerReq.getUsername())
                    .email(customerReq.getEmail())
//                    .password(passwordEncoder.encode(customerReq.getPassword()))
                    .isLocked(false)
                    .isEnabled(false)
                    .createdAt(new Date())
                    .updatedAt(new Date())
                    .isDeleted(false)
                    .role(this.roleRepository.findById(2).orElseThrow(() -> new EntityNotFoundException("Role not found")))
                    .build();
            user = this.userRepository.save(user);

            Customer customer = Customer.builder()
                    .firstName(customerReq.getFirstName())
                    .lastName(customerReq.getLastName())
                    .phoneNumber(customerReq.getPhoneNumber())
                    .gender(customerReq.getGender())
                    .user(user)
                    .customerAddress(address)
                    .dateOfBirth(customerReq.getDateOfBirth())
                    .createdAt(new Date())
                    .build();
            return customerRepository.save(customer).getId();
        }
    }

    @Transactional
    @Override
    public long updateCustomer(Long id, CustomerRequest customerRequest) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        CustomerAddress customerAddress = customer.getCustomerAddress();
        if (customerAddress == null) {
            customerAddress = new CustomerAddress();
        }
        User user = customer.getUser();

        if (this.customerRepository.existsByEmail(customerRequest.getEmail()) &&
                !user.getEmail().equals(customerRequest.getEmail())) {
            throw new EntityExistsException("Email đã tồn tại.");
        } else if (this.customerRepository.existsByPhoneNumber(customerRequest.getPhoneNumber()) &&
                !customer.getPhoneNumber().equals(customerRequest.getPhoneNumber())) {
            throw new EntityExistsException("Số điện thoại đã tồn tại.");
        }
        if (user == null) {
            user = new User();
        }
        customerAddress.setCity(customerRequest.getCity());
        customerAddress.setCityId(customerRequest.getCity_id());
        customerAddress.setDistrict(customerRequest.getDistrict());
        customerAddress.setDistrictId(customerRequest.getDistrict_id());
        customerAddress.setWard(customerRequest.getWard());
        customerAddress.setStreetName(customerRequest.getStreetName());
        user.setEmail(customerRequest.getEmail());
        customerAddress = customerAddressRepository.save(customerAddress);
        user = userRepository.save(user);
        customer.setCustomerAddress(customerAddress);
        customer.setUser(user);
        populateCustomerData(customer, customerRequest);
        return customerRepository.save(customer).getId();
        
    }

    @Transactional
    @Override
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng"));
        CustomerAddress address = customerAddressRepository.findById(customer.getCustomerAddress().getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy địa chỉ khách hàng"));
        User user = userRepository.findById(customer.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin người dùng"));
        if (customer.getPublicId() != null) {
            this.cloudinary.removeByPublicId(customer.getPublicId());
        }
        customerRepository.delete(customer);
        userRepository.delete(user);
        customerAddressRepository.delete(address);
    }

    @Override
    public Page<CustomerResponse> searchCustomers(String keyword, Gender gender, Date birth, Pageable pageable) {
        Page<Customer> customers = customerRepository.searchCustomers(keyword, gender, birth, pageable);
        return customers.map(this::convertCustomerResponse);
    }

    @Override
    public void updateImage(ProductImageReq req) {
        Customer customer = this.customerRepository.findById(req.getProductId()).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng"));
        if (req.getImages() != null && customer.getPublicId() != null) {
            this.cloudinary.removeByPublicId(customer.getPublicId());
        }
        assert req.getImages() != null;
        Map<String, String> uploadResult = this.cloudinary.upload(req.getImages()[0]);
        customer.setImage(uploadResult.get("url"));
        customer.setPublicId(uploadResult.get("publicId"));
        customerRepository.save(customer);
    }

    private void populateCustomerData(Customer customer, CustomerRequest customerRequest) {
        customer.setFirstName(customerRequest.getFirstName());
        customer.setLastName(customerRequest.getLastName());
        customer.setPhoneNumber(customerRequest.getPhoneNumber());
        customer.setGender(customerRequest.getGender());
        customer.setDateOfBirth(customerRequest.getDateOfBirth());
        customer.setUpdatedAt(new Date());
    }

    private CustomerResponse convertCustomerResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .fullName(String.format("%s %s", customer.getLastName(), customer.getFirstName()))
                .phoneNumber(customer.getPhoneNumber())
                .username(customer.getUser().getUsername())
                .email(customer.getUser().getEmail())
                .dateOfBirth(customer.getDateOfBirth())
                .gender(customer.getGender())
                .city(customer.getCustomerAddress().getCity())
                .city_id(customer.getCustomerAddress().getCityId())
                .district(customer.getCustomerAddress().getDistrict())
                .district_id(customer.getCustomerAddress().getDistrictId())
                .ward(customer.getCustomerAddress().getWard())
                .streetName(customer.getCustomerAddress().getStreetName())
                .isLocked(customer.getUser().getIsLocked())
                .image(customer.getImage())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }
}