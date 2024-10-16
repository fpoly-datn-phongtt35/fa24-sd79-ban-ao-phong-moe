package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.CustomerReq;
import sd79.dto.response.CustomerResponse;
import sd79.enums.Gender;
import sd79.exception.EntityNotFoundException;
import sd79.model.Customer;
import sd79.model.CustomerAddress;
import sd79.repositories.CustomerAddressRepository;
import sd79.repositories.CustomerRepository;
import sd79.service.CustomerService;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerAddressRepository customerAddressRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> getAll(Pageable pageable) {  // Modified method to return a paginated response
        Page<Customer> customers = customerRepository.findAll(pageable);
        return customers.map(this::convertCustomerResponse);
    }

    @Override
    @Transactional(readOnly = true)
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

        Customer customer = Customer.builder()
                .firstName(customerReq.getFirstName())
                .lastName(customerReq.getLastName())
                .phoneNumber(customerReq.getPhoneNumber())
                .gender(customerReq.getGender())
                .image(customerReq.getImage())
                .customerAddress(address)
                .dateOfBirth(customerReq.getDateOfBirth())
                .createdAt(new Date())
                .build();
        return customerRepository.save(customer).getId();
    }

    @Transactional
    @Override
    public long updateCustomer(Long id, CustomerReq customerReq) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        CustomerAddress customerAddress = customer.getCustomerAddress();
        if (customerAddress == null) {
            customerAddress = new CustomerAddress();
        }
        customerAddress.setCity(customerReq.getCity());
        customerAddress.setDistrict(customerReq.getDistrict());
        customerAddress.setWard(customerReq.getWard());
        customerAddress.setStreetName(customerReq.getStreetName());
        customerAddress = customerAddressRepository.save(customerAddress);
        customer.setCustomerAddress(customerAddress);
        populateCustomerData(customer, customerReq);
        return customerRepository.save(customer).getId();
    }

    @Transactional
    @Override
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        customerRepository.delete(customer);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<CustomerResponse> searchCustomers(String keyword, Gender gender,Date birth, Pageable pageable) {
        Page<Customer> customers = customerRepository.searchCustomers( keyword,gender,birth, pageable);
        return customers.map(this::convertCustomerResponse);
    }

    private void populateCustomerData(Customer customer, CustomerReq customerReq) {
        customer.setFirstName(customerReq.getFirstName());
        customer.setLastName(customerReq.getLastName());
        customer.setPhoneNumber(customerReq.getPhoneNumber());
        customer.setGender(customerReq.getGender());
        customer.setImage(customerReq.getImage());
        customer.setDateOfBirth(customerReq.getDateOfBirth());
        customer.setUpdatedAt(new Date());
    }

    private CustomerResponse convertCustomerResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .phoneNumber(customer.getPhoneNumber())
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