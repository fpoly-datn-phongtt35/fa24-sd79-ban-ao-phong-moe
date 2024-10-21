package sd79.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sd79.dto.requests.CustomerReq;
import sd79.dto.response.CustomerResponse;
import sd79.model.Customer;

import java.util.Date;
import java.util.List;

public interface CustomerService {

    List<CustomerResponse> getAll();


    CustomerResponse getCustomerById(Long id);


    long createCustomer(CustomerReq customerReq);


    long updateCustomer(Long id, CustomerReq customerReq);


    void deleteCustomer(Long id);


    Page<CustomerResponse> searchCustomers(Date startDate, Date endDate, String firstName, String lastName, String phoneNumber, Pageable pageable);


    List<Customer> findByKeywordAndDate(String keyword, Date startDate, Date endDate);
}
