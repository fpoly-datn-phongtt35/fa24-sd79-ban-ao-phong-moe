package sd79.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.CustomerReq;
import sd79.dto.response.ResponseData;
import sd79.model.Customer;
import sd79.service.CustomerService;
import sd79.service.impl.CustomerServiceImpl;

@RestController
@CrossOrigin
@RequestMapping("/api/${api.version}/customer")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    public ResponseData<?> getAll() {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", customerService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseData<?> delete(@PathVariable long id){
        customerService.delete(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Success");
    }
    @PostMapping("/store")
    public ResponseData<?> add(@Valid @RequestBody CustomerReq customerReq){
        customerService.save(customerReq);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Success");
    }
    @PutMapping("/update/{id}")
    public ResponseData<?> update(@PathVariable Long id, @Valid @RequestBody CustomerReq customerReq){
        customerService.update(id, customerReq);
        return new ResponseData<>(HttpStatus.OK.value(), "Success");
    }
}
