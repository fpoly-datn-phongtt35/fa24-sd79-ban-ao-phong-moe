package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import sd79.dto.requests.CustomerReq;
import sd79.dto.response.CustomerResponse;
import sd79.model.Customer;
import sd79.model.CustomerAddress;
import sd79.repositories.CustomerAddressRepository;
import sd79.repositories.CustomerRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl {
    private final CustomerRepository customerRepository;



    public List<?> gettAll(){
        return customerRepository.findAll();
    }
    public Customer findById(Long id){
        Optional<Customer> customer = customerRepository.findById(Math.toIntExact(id));
        return customer.orElseGet(Customer::new);
    }
    public Customer save(Customer customer){
        return this.customerRepository.save(customer);
    }
    public String deleteById(Long id){
        try {
            this.customerRepository.deleteById(Math.toIntExact(id));
            return "Delete success";
        }catch (Exception e){
            return "Delete failed";
        }
    }
    public Customer update(Customer customer, long id) {
        Optional<Customer> optional = this.customerRepository.findById(Math.toIntExact(id));
        return optional.map(o ->{
            o.setFirstName(customer.getFirstName());
            o.setLastName(customer.getLastName());
            o.setPhoneNumber(customer.getPhoneNumber());
            o.setImage(customer.getImage());
            o.setGender(customer.getGender());
            o.setDateOfBirth(customer.getDateOfBirth());
            o.setUpdatedAt(customer.getUpdatedAt());
            return this.customerRepository.save(o);
        }).orElse(null);
    }


}
