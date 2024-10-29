package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.CustomerReq;
import sd79.dto.requests.productRequests.CustomerRequest;
import sd79.dto.requests.productRequests.ProductImageReq;
import sd79.dto.response.CustomerResponse;
import sd79.dto.response.ResponseData;
import sd79.enums.Gender;
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

    // Lấy danh sách khách hàng (có phân trang)
    @Operation(
            summary = "Get All Customers (Paginated)",
            description = "Retrieve paginated list of customers from the database"
    )
    @GetMapping
    public ResponseData<?> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,  // Page number
            @RequestParam(defaultValue = "5") int size,  // Page size
            @RequestParam(defaultValue = "id") String sortBy,  // Sorting criteria
            @RequestParam(defaultValue = "asc") String sortDir  // Sorting direction (asc or desc)
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CustomerResponse> customers = customerService.getAll(pageable);
        return new ResponseData<>(HttpStatus.OK.value(), "List of customers (paginated)", customers);
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
        return new ResponseData<>(HttpStatus.CREATED.value(), "Thêm khách hàng thành công", customerService.createCustomer(customerReq));
    }

    // Cập nhật khách hàng
    @Operation(
            summary = "Update Customer",
            description = "Update customer information in the database"
    )
    @PutMapping("/update/{id}")
    public ResponseData<?> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerRequest customerRequest) {
        return new ResponseData<>(HttpStatus.OK.value(), "Sửa thông tin khách hàng thành công", customerService.updateCustomer(id, customerRequest));
    }

    // Xóa khách hàng
    @Operation(
            summary = "Delete Customer",
            description = "Delete a customer by ID"
    )
    @DeleteMapping("/delete/{id}")
    public ResponseData<?> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Xóa thành công");
    }

    @Operation(
            summary = "Search Customers",
            description = "Search customers by keyword, gender, and date of birth with pagination"
    )
    @GetMapping("/search")
    public ResponseData<?> searchCustomers(
            @RequestParam(required = false) String keyword,  // Search keyword (can be null)
            @RequestParam(required = false) String genderStr,  // Gender as String (can be null)
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateOfBirth,  // Date of birth (can be null)
            @RequestParam(defaultValue = "0") int page,  // Page number
            @RequestParam(defaultValue = "5") int size,  // Page size
            @RequestParam(defaultValue = "id") String sortBy,  // Sorting criteria
            @RequestParam(defaultValue = "asc") String sortDir  // Sorting direction (asc or desc)
    ) {
        // Convert gender string to Gender enum, handling null and invalid cases
        Gender gender = null;
        if (genderStr != null) {
            try {
                gender = Gender.valueOf(genderStr.toUpperCase());  // Convert to enum, handle case insensitivity
            } catch (IllegalArgumentException e) {
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Invalid gender value", null);
            }
        }

        // Set up pagination and sorting
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        // Call the service layer to search customers
        Page<CustomerResponse> customers = customerService.searchCustomers(keyword, gender, dateOfBirth, pageable);

        // Return the paginated search results
        return new ResponseData<>(HttpStatus.OK.value(), "Search results (paginated)", customers);
    }

//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    @ResponseStatus(HttpStatus.BAD_REQUEST)
//    public ResponseData<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
//        Map<String, String> errors = new HashMap<>();
//        ex.getBindingResult().getAllErrors().forEach((error) -> {
//            String fieldName = ((FieldError) error).getField();
//            String errorMessage = error.getDefaultMessage();
//            errors.put(fieldName, errorMessage);
//        });
//        return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Validation failed", errors);
//    }

    @Operation(
            summary = "Upload image",
            description = "Upload the image to cloudinary and return the url to save to the database"
    )
    @PostMapping("/upload")
    public ResponseData<?> uploadFile(@Valid @ModelAttribute ProductImageReq request) {
        this.customerService.updateImage(request);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Successfully added customer images");
    }
}
