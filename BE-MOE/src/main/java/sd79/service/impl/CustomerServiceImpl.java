package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.CustomerReq;
import sd79.dto.response.CustomerResponse;
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
    public List<CustomerResponse> getAll() { // Retrieve all customers
        return customerRepository.findAll().stream()
                .map(this::convertCustomerResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) { // Retrieve customer by ID
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        return convertCustomerResponse(customer);
    }

    @Transactional
    @Override
    public long createCustomer(CustomerReq customerReq) { // Create a new customer

        CustomerAddress address = CustomerAddress.builder()
                .city(customerReq.getCity())
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
    public long updateCustomer(Long id, CustomerReq customerReq) { // Update an existing customer
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        CustomerAddress customerAddress = customer.getCustomerAddress();
        if (customerAddress == null) {
            customerAddress = new CustomerAddress();
        }
        customerAddress.setCity(customerReq.getCity());
        customerAddressRepository.save(customerAddress);
        populateCustomerData(customer, customerReq);
        return customerRepository.save(customer).getId();
    }

    @Transactional
    @Override
    public void deleteCustomer(Long id) { // Delete a customer by ID
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        customerRepository.delete(customer);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<CustomerResponse> searchCustomers(Date startDate, Date endDate, String firstName, String lastName, String phoneNumber, Pageable pageable) {
        Page<Customer> customers = customerRepository.searchCustomers(startDate, endDate, firstName, lastName, phoneNumber, pageable);
        return customers.map(this::convertCustomerResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Customer> findByKeywordAndDate(String keyword, Date startDate, Date endDate) { // Find by keyword and date range
        return customerRepository.findByKeywordAndDate(keyword, startDate, endDate);
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
                .customerAddress(customer.getCustomerAddress().getCity())
                .image(customer.getImage())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }
}
