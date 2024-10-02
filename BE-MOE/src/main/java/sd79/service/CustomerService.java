package sd79.service;

import sd79.dto.requests.CustomerReq;
import sd79.dto.response.CustomerResponse;

import java.util.List;

public interface CustomerService {
    List<CustomerResponse> getAll();
    CustomerResponse getCustomerById(Long id);
    void save(CustomerReq customerReq);
    void update(Long id, CustomerReq customerReq);
    void delete(Long id);
}
