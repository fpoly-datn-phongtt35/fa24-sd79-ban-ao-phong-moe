package sd79.service.impl;

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
import sd79.enums.Gender;
import sd79.exception.EntityNotFoundException;
import sd79.model.Customer;
import sd79.model.CustomerAddress;
import sd79.model.User;
import sd79.repositories.CustomerAddressRepository;
import sd79.repositories.CustomerRepository;
import sd79.repositories.auth.RoleRepository;
import sd79.repositories.auth.UserRepository;
import sd79.service.CustomerService;
import sd79.utils.CloudinaryUtils;

import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

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
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        return convertCustomerResponse(customer);
    }

    @Transactional
    @Override
    public long createCustomer(CustomerReq customerReq) {
        CustomerAddress address = CustomerAddress.builder()
                .city(customerReq.getCity())
                .district(customerReq.getDistrict())
                .ward(customerReq.getWard())
                .streetName(customerReq.getStreetName())
                .build();
        address = this.customerAddressRepository.save(address);

        User user = User.builder()
                .username(customerReq.getUsername())
                .email(customerReq.getEmail())
                .password(passwordEncoder.encode(customerReq.getPassword()))
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
        if (user == null) {
            user = new User();
        }
        customerAddress.setCity(customerRequest.getCity());
        customerAddress.setDistrict(customerRequest.getDistrict());
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
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        if (customer.getPublicId() != null) {
            this.cloudinary.removeByPublicId(customer.getPublicId());
        }
        customerRepository.delete(customer);
    }

    @Override
    public Page<CustomerResponse> searchCustomers(String keyword, Gender gender, Date birth, Pageable pageable) {
        Page<Customer> customers = customerRepository.searchCustomers(keyword, gender, birth, pageable);
        return customers.map(this::convertCustomerResponse);
    }

    @Override
    public void updateImage(ProductImageReq req) {
        Customer customer = this.customerRepository.findById(req.getProductId()).orElseThrow(() -> new EntityNotFoundException("Customer not found"));
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
                .district(customer.getCustomerAddress().getDistrict())
                .ward(customer.getCustomerAddress().getWard())
                .streetName(customer.getCustomerAddress().getStreetName())
                .image(customer.getImage())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }
}