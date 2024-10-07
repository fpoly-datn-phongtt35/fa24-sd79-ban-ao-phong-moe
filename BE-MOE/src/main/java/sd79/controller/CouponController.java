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
import sd79.dto.requests.CouponRequest;
import sd79.dto.response.CouponResponse;
import sd79.dto.response.ResponseData;
import sd79.model.Coupon;
import sd79.service.CouponService;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/${api.version}/coupon")
@Tag(name = "Coupon Controller", description = "Manage adding, editing, and deleting product coupon")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    // Lấy danh sách coupon
    @Operation(
            summary = "Get Coupon",
            description = "Get all coupon from database"
    )
    @GetMapping
    public ResponseData<?> getCoupons() {
        return new ResponseData<>(HttpStatus.OK.value(), "List coupon", couponService.getCoupon());
    }

    // Lấy thông tin coupon theo ID
    @GetMapping("/detail/{id}")
    public ResponseData<?> getCouponById(@PathVariable Long id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Coupon details", couponService.getCouponById(id));
    }

    // Thêm mới coupon
    @Operation(
            summary = "New Coupon",
            description = "New coupon into database"
    )
    @PostMapping("/store")
    public ResponseData<?> addCoupon(@Valid @RequestBody CouponRequest couponRequest) {
        ;
        return new ResponseData<>(HttpStatus.CREATED.value(), "Coupon created successfully", couponService.createCoupon(couponRequest));
    }

    // Cập nhật coupon
    @Operation(
            summary = "Update Coupon",
            description = "Update coupon into database"
    )
    @PutMapping("/update/{id}")
    public ResponseData<?> updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponRequest couponRequest) {
        return new ResponseData<>(HttpStatus.OK.value(), "Coupon updated successfully", couponService.updateCoupon(id, couponRequest));
    }

    // Xóa coupon
    @Operation(
            summary = "Delete Coupon",
            description = "Set is delete of coupon to true and hidde from from"
    )
    @DeleteMapping("/delete/{id}")
    public ResponseData<?> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Coupon deleted successfully");
    }

//    @GetMapping("/search")
//    public ResponseData<?> searchCoupons(
//            @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
//            @RequestParam(value = "endDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
//            @RequestParam(value = "name", required = false) String name,
//            @RequestParam(value = "code", required = false) String code,
//            @RequestParam(value = "page", defaultValue = "0") int page,
//            @RequestParam(value = "size", defaultValue = "10") int size,
//            @RequestParam(value = "sort", defaultValue = "startDate") String sortBy,
//            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {
//        Pageable pageable = PageRequest.of(page, size, Sort.Direction.fromString(direction), sortBy);
//        Page<CouponResponse> result = couponService.searchCoupons(startDate, endDate, name, code, pageable);
//
//        return new ResponseData<>(HttpStatus.OK.value(), "Search results", result.getContent());
//    }

    @GetMapping("/searchKeywordAndDate")
    public ResponseData<?> searchKeywordAndDate(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {

        List<Coupon> results = couponService.findByKeywordAndDate(keyword, startDate, endDate);
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
