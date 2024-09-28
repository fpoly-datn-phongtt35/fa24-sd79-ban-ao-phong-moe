package sd79.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sd79.model.Customer;
import sd79.repositories.CustomerRepository;
import sd79.service.CustomerService;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.findAll();
    }

    @DeleteMapping("{id}")
    public void deleteCustomer(@PathVariable Long id) {
        this.customerService.deleteById(id);
    }
    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer) {
       return this.customerService.saveOrUpdate(customer);
    }
    @PutMapping
    public Customer updateCustomer(@RequestBody Customer customer) {
        return this.customerService.saveOrUpdate(customer);
    }
}
