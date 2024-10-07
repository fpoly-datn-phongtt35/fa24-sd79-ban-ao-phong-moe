package sd79.service;

import sd79.dto.requests.CustomerReq;
import sd79.dto.response.CustomerResponse;
import sd79.model.Coupon;
import sd79.model.Customer;

import java.util.Date;
import java.util.List;

public interface CustomerService {
    List<CustomerResponse> getAll();
    CustomerResponse getCustomerById(Long id);
    void save(CustomerReq customerReq);
    void update(Long id, CustomerReq customerReq);
    void delete(Long id);
    List<Customer> findByNameOrPhone(String fistName, String lastName, String phoneNumber);

    }
