package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.EmployeeReq;
import sd79.dto.response.ResponseData;
import sd79.repositories.PositionsRepository;
import sd79.service.EmployeeService;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/${api.version}/employee")
@Tag(name = "Employee Controller", description = "Manage adding, editing, and deleting product employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    private final PositionsRepository positionsRepository;

    // Lấy danh sách employee
    @Operation(
            summary = "Get Employee",
            description = "Get all employee from database"
    )
    @GetMapping
    public ResponseData<?> getEmployees() {
        return new ResponseData<>(HttpStatus.OK.value(), "List employee", employeeService.getEmployee());
    }

    @GetMapping("/positions")
    public ResponseData<?> getPositions(){
        return new ResponseData<>(HttpStatus.OK.value(),"List positions",positionsRepository.findAll());
    }

    // Lấy thông tin employee theo ID
    @GetMapping("{id}")
    public ResponseData<?> getEmployeeById(@PathVariable Integer id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Employee details", employeeService.getEmployeeById(id));
    }

    // Thêm mới employee
    @Operation(
            summary = "New Employee",
            description = "New employee into database"
    )
    @PostMapping
    public ResponseData<?> addEmployee(@Valid @RequestBody EmployeeReq employeeRequest) {
        System.out.println("du lieu" + employeeRequest);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Employee created successfully", employeeService.storeEmployee(employeeRequest));
    }

    // Cập nhật employee
    @Operation(
            summary = "Update Employee",
            description = "Update employee into database"
    )
    @PutMapping("/{id}")
    public ResponseData<?> updateEmployee(@PathVariable Integer id, @Valid @RequestBody EmployeeReq employeeRequest) {
        employeeService.updateEmp(employeeRequest, id);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Employee updated successfully");
    }

    // Xóa employee
    @Operation(
            summary = "Delete Employee",
            description = "Set is delete of employee to true and hidde from from"
    )
    @DeleteMapping("{id}")
    public ResponseData<?> deleteEmployee(@PathVariable Integer id) {
        employeeService.deleteEmployee(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Employee deleted successfully");
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
