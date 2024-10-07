package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.dto.requests.CustomerReq;
import sd79.dto.response.CustomerResponse;
import sd79.model.Customer;
import sd79.repositories.CustomerRepository;
import sd79.service.CustomerService;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;


    @Override
    public List<CustomerResponse> getAll() {

        return customerRepository.findAll().stream().map(this::convertCustomerResponse).toList();
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(Math.toIntExact(id)).orElseThrow(() ->
                new IllegalArgumentException("Customer not found"));
        return convertCustomerResponse(customer);
    }

    @Override
    public void save(CustomerReq customerReq) {
        Customer customer = new Customer();
        populateCustomerData(customer, customerReq);
        customerRepository.save(customer);
    }

    @Override
    public void update(Long id, CustomerReq customerReq) {
        Customer customer = customerRepository.findById(Math.toIntExact(id)).orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        populateCustomerData(customer, customerReq);
        customerRepository.save(customer);
    }

    @Override
    public void delete(Long id) {
        Customer customer = customerRepository.findById(Math.toIntExact(id)).orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        customerRepository.delete(customer);
    }

    @Override
    public List<Customer> findByNameOrPhone(String fistName, String lastName, String phoneNumber) {
        return customerRepository.findByNameOrPhone(fistName,lastName, phoneNumber);
    }



    private void populateCustomerData(Customer customer, CustomerReq customerReq) {
        customer.setFirstName(customerReq.getFirstName());
        customer.setLastName(customerReq.getLastName());
        customer.setPhoneNumber(customerReq.getPhoneNumber());
        customer.setGender(customerReq.getGender());
        customer.setImage(customerReq.getImage());
        customer.setDateOfBirth(customerReq.getDateOfBirth());
        customer.setCreatedAt(new Date());
    }

    private CustomerResponse convertCustomerResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .phoneNumber(customer.getPhoneNumber())
                .dateOfBirth(customer.getDateOfBirth())
                .gender(customer.getGender())
                .image(customer.getImage())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

}
