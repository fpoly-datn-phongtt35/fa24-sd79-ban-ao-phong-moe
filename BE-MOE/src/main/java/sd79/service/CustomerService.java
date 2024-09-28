package sd79.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import sd79.model.Customer;
import sd79.model.CustomerAddress;
import sd79.repositories.CustomerAddressRepository;
import sd79.repositories.CustomerRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;

    public List<Customer> findAll(){
        return customerRepository.findAll();
    }
    public Customer findById(Long id){
        Optional<Customer> customer = customerRepository.findById(Math.toIntExact(id));
        return customer.orElseGet(Customer::new);
    }
    public Customer saveOrUpdate(Customer customer){
        return this.customerRepository.save(customer);
    }
    public void deleteById(Long id){
        this.customerRepository.deleteById(Math.toIntExact(id));
    }

}
