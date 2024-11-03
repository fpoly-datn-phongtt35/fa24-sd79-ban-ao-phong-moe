package sd79.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sd79.dto.requests.CustomerReq;
import sd79.dto.requests.productRequests.CustomerRequest;
import sd79.dto.requests.productRequests.ProductImageReq;
import sd79.dto.response.CustomerResponse;
import sd79.dto.response.auth.UserResponse;
import sd79.enums.Gender;
import sd79.enums.ProductStatus;
import sd79.model.Customer;
import sd79.model.User;
import sd79.repositories.auth.UserRepository;

import java.util.Date;
import java.util.List;

public interface CustomerService {

    Page<CustomerResponse> getAll(Pageable pageable);  // Modified method to add pagination

    CustomerResponse getCustomerById(Long id);

    long createCustomer(CustomerReq customerReq);

    long updateCustomer(Long id, CustomerRequest customerRequest);

    void deleteCustomer(Long id);

    void setUserLocked(long id,Boolean isLocked);

    Page<CustomerResponse> searchCustomers(String keyword, Gender gender,Date birth, Pageable pageable);

    void updateImage(ProductImageReq req);
}
