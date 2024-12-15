package sd79.service.clients.impl;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sd79.dto.requests.clients.accountInfo.AccountImageReq;
import sd79.dto.requests.productRequests.AddressAccountRequest;
import sd79.dto.requests.productRequests.CustomerRequest;
import sd79.dto.requests.productRequests.PassWordRequest;
import sd79.dto.requests.productRequests.ProductRequest;
import sd79.dto.response.clients.customer.UserAccountInfoRes;
import sd79.dto.response.clients.customer.UserAddressInfoRes;
import sd79.dto.response.clients.product.ProductResponse;
import sd79.exception.CustomerException;
import sd79.exception.EntityNotFoundException;
import sd79.model.*;
import sd79.repositories.BillDetailRepo;
import sd79.repositories.BillStatusDetailRepo;
import sd79.repositories.CustomerAddressRepository;
import sd79.repositories.CustomerRepository;
import sd79.repositories.auth.RoleRepository;
import sd79.repositories.auth.UserRepository;
import sd79.repositories.products.ProductDetailRepository;
import sd79.repositories.products.ProductRepository;
import sd79.repositories.promotions.PromotionDetailRepository;
import sd79.service.clients.AccountManagerService;
import sd79.service.impl.CustomerServiceImpl;
import sd79.utils.CloudinaryUtils;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountManagerServiceImpl implements AccountManagerService {
    private static final Logger log = LoggerFactory.getLogger(CustomerServiceImpl.class);
    private final CustomerRepository customerRepository;
    private final CustomerAddressRepository customerAddressRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final CloudinaryUtils cloudinary;


    @Override
    public UserAccountInfoRes getAccountbyId(Long id) {
        Customer customer = this.customerRepository.findByUserId(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin"));
        return UserAccountInfoRes.builder()
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .phoneNumber(customer.getPhoneNumber())
                .email(customer.getUser().getEmail())
                .dateOfBirth(customer.getDateOfBirth())
                .gender(customer.getGender())
                .image(customer.getImage())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

    @Override
    public UserAddressInfoRes getAddressbyId(Long id) {
        Customer customer = this.customerRepository.findByUserId(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin"));
        return UserAddressInfoRes.builder()
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .fullName(String.format("%s %s", customer.getLastName(), customer.getFirstName()))
                .city(customer.getCustomerAddress().getCity())
                .city_id(customer.getCustomerAddress().getCityId())
                .district(customer.getCustomerAddress().getDistrict())
                .district_id(customer.getCustomerAddress().getDistrictId())
                .ward(customer.getCustomerAddress().getWard())
                .streetName(customer.getCustomerAddress().getStreetName())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

    @Override
    public long accountInformation(Long id, CustomerRequest customerRequest) {
        Customer customer = this.customerRepository.findByUserId(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin"));
        User user = customer.getUser();
        if (user == null) {
            user = new User();
        }
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
        user.setEmail(customerRequest.getEmail());
        user = userRepository.save(user);
        customer.setUser(user);
        populateCustomerData(customer, customerRequest);
        return customerRepository.save(customer).getId();
    }

    @Override
    public long addressInformation(Long id, AddressAccountRequest addressAccountRequest) {
        Customer customer = this.customerRepository.findByUserId(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin"));

        CustomerAddress customerAddress = customer.getCustomerAddress();
        if (customerAddress == null) {
            customerAddress = new CustomerAddress();
        }
        customerAddress.setCity(addressAccountRequest.getCity());
        customerAddress.setCityId(addressAccountRequest.getCity_id());
        customerAddress.setDistrict(addressAccountRequest.getDistrict());
        customerAddress.setDistrictId(addressAccountRequest.getDistrict_id());
        customerAddress.setWard(addressAccountRequest.getWard());
        customerAddress.setStreetName(addressAccountRequest.getStreetName());
        customer.setCustomerAddress(customerAddress);
        customer.setUpdatedAt(new Date());
        return customerRepository.save(customer).getId();
    }

    @Override
    public long UpdatePassWord(Long id, PassWordRequest passWordRequest) {
        Customer customer = customerRepository.findByUserId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin người dùng"));
        User user = customer.getUser();


        if (!passwordEncoder.matches(passWordRequest.getCurrentPassword(), user.getPassword())) {
            throw new EntityExistsException("Mật khẩu cũ không chính xác");
        }


        user.setPassword(passwordEncoder.encode(passWordRequest.getNewPassword()));
        userRepository.save(user);

        customer.setUpdatedAt(new Date());
        return this.customerRepository.save(customer).getId();

    }

    @Override
    public void updateImageAccInfo(AccountImageReq req) {
        Customer customer = this.customerRepository.findByUserId(req.getUserId()).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin"));
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


}
