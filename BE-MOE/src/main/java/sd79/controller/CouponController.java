package sd79.controller;

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
import sd79.dto.requests.CouponRequest;
import sd79.dto.response.CouponResponse;
import sd79.dto.response.ResponseData;
import sd79.service.CouponService;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    // Lấy danh sách coupon
    @GetMapping
    public ResponseData<?> getCoupons() {
        return new ResponseData<>(HttpStatus.OK.value(), "List coupon", couponService.getCoupon());
    }

    // Lấy thông tin coupon theo ID
    @GetMapping("/{id}")
    public ResponseData<?> getCouponById(@PathVariable Long id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Coupon details", couponService.getCouponById(id));
    }

    // Thêm mới coupon
    @PostMapping
    public ResponseData<?> addCoupon(@Valid @RequestBody CouponRequest couponRequest) {
        couponService.createCoupon(couponRequest);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Coupon created successfully");
    }

    // Cập nhật coupon
    @PutMapping("/{id}")
    public ResponseData<?> updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponRequest couponRequest) {
        couponService.updateCoupon(id, couponRequest);
        return new ResponseData<>(HttpStatus.OK.value(), "Coupon updated successfully");
    }

    // Xóa coupon
    @DeleteMapping("/{id}")
    public ResponseData<?> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Coupon deleted successfully");
    }

    @GetMapping("/search")
    public ResponseData<?> searchCoupons(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "startDate") String sortBy,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.fromString(direction), sortBy);
        Page<CouponResponse> result = couponService.searchCoupons(startDate, endDate, name, code, pageable);

        return new ResponseData<>(HttpStatus.OK.value(), "Search results", result.getContent());
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
