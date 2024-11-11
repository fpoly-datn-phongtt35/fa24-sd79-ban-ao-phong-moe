package sd79.service.clients.impl;

import jakarta.persistence.EntityExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import sd79.dto.requests.productRequests.CustomerRequest;
import sd79.exception.EntityNotFoundException;
import sd79.model.Customer;
import sd79.model.CustomerAddress;
import sd79.model.User;
import sd79.repositories.CustomerAddressRepository;
import sd79.repositories.CustomerRepository;
import sd79.repositories.auth.RoleRepository;
import sd79.repositories.auth.UserRepository;
import sd79.service.clients.AccountManager;
import sd79.service.impl.CustomerServiceImpl;
import sd79.utils.CloudinaryUtils;

import java.util.Date;

public class AccountManagerImpl implements AccountManager {
    private static final Logger log = LoggerFactory.getLogger(CustomerServiceImpl.class);
    private  CustomerRepository customerRepository;
    private  CustomerAddressRepository customerAddressRepository;
    private  UserRepository userRepository;
    private  RoleRepository roleRepository;
    private  PasswordEncoder passwordEncoder;

    private  CloudinaryUtils cloudinary;


    @Override
    public long accountInformation(Long id, CustomerRequest customerRequest) {
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

    private void populateCustomerData(Customer customer, CustomerRequest customerRequest) {
        customer.setFirstName(customerRequest.getFirstName());
        customer.setLastName(customerRequest.getLastName());
        customer.setPhoneNumber(customerRequest.getPhoneNumber());
        customer.setGender(customerRequest.getGender());
        customer.setDateOfBirth(customerRequest.getDateOfBirth());
        customer.setUpdatedAt(new Date());
    }
}
