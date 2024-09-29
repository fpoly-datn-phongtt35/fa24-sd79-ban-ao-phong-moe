package sd79.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.CustomerReq;
import sd79.model.Customer;
import sd79.repositories.CustomerRepository;
import sd79.service.CustomerService;
import sd79.service.impl.CustomerServiceImpl;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/${api.version}/customer")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerServiceImpl customerServiceIm;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(this.customerServiceIm.gettAll());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable long id){
        return ResponseEntity.ok(this.customerServiceIm.deleteById(id));
    }
    @PostMapping
    public ResponseEntity<?> add(@RequestBody Customer customer){
        return ResponseEntity.ok(this.customerServiceIm.save(customer));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable long id, @RequestBody Customer customer){
        return ResponseEntity.ok(this.customerServiceIm.update(customer, id));
    }
}
