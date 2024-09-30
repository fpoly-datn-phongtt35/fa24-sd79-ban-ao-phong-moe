package sd79.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.CustomerReq;
import sd79.dto.response.ResponseData;
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
    public ResponseData<?> getAll() {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", customerServiceIm.gettAll());
    }

    @DeleteMapping("/{id}")
    public ResponseData<?> delete(@PathVariable long id){
        return new ResponseData<>(HttpStatus.OK.value(), "Success", customerServiceIm.deleteById(id));
    }
    @PostMapping("/store")
    public ResponseData<?> add(@RequestBody Customer customer){
        return new ResponseData<>(HttpStatus.OK.value(), "Success", customerServiceIm.save(customer));
    }
    @PutMapping("/update/{id}")
    public ResponseData<?> update(@PathVariable long id, @RequestBody Customer customer){
        return new ResponseData<>(HttpStatus.OK.value(), "Success", customerServiceIm.update(customer,id));
    }
}
