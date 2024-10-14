package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.CustomerReq;
import sd79.dto.response.ResponseData;
import sd79.model.Customer;
import sd79.service.CustomerService;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/${api.version}/customer")
@Tag(name = "Customer Controller", description = "Manage adding, editing, and deleting customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // Lấy danh sách khách hàng
    @Operation(
            summary = "Get All Customers",
            description = "Retrieve all customers from the database"
    )
    @GetMapping
    public ResponseData<?> getAllCustomers() {
        return new ResponseData<>(HttpStatus.OK.value(), "List of customers", customerService.getAll());
    }

    // Lấy thông tin khách hàng theo ID
    @Operation(
            summary = "Get Customer by ID",
            description = "Retrieve customer information by ID"
    )
    @GetMapping("/detail/{id}")
    public ResponseData<?> getCustomerById(@PathVariable Long id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Customer details", customerService.getCustomerById(id));
    }

    // Thêm mới khách hàng
    @Operation(
            summary = "Create New Customer",
            description = "Add a new customer into the database"
    )
    @PostMapping("/store")
    public ResponseData<?> addCustomer(@Valid @RequestBody CustomerReq customerReq) {
        return new ResponseData<>(HttpStatus.CREATED.value(), "Customer created successfully", customerService.createCustomer(customerReq));
    }

    // Cập nhật khách hàng
    @Operation(
            summary = "Update Customer",
            description = "Update customer information in the database"
    )
    @PutMapping("/update/{id}")
    public ResponseData<?> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerReq customerReq) {
        return new ResponseData<>(HttpStatus.OK.value(), "Customer updated successfully", customerService.updateCustomer(id, customerReq));
    }

    // Xóa khách hàng
    @Operation(
            summary = "Delete Customer",
            description = "Delete a customer by ID"
    )
    @DeleteMapping("/delete/{id}")
    public ResponseData<?> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Customer deleted successfully");
    }


    @Operation(
            summary = "Search Customers by Keyword and Date",
            description = "Search for customers based on keyword and date range"
    )
    @GetMapping("/searchKeywordAndDate")
    public ResponseData<?> searchCustomersByKeywordAndDate(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {

        List<Customer> results = customerService.findByKeywordAndDate(keyword, startDate, endDate);
        return new ResponseData<>(HttpStatus.OK.value(), "Search results", results);
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseData<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Validation failed", errors);
    }
}
