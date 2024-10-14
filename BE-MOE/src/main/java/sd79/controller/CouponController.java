package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sd79.dto.requests.CouponImageReq;
import sd79.dto.requests.CouponRequest;
import sd79.dto.response.CouponResponse;
import sd79.dto.response.ResponseData;
import sd79.enums.TodoDiscountType;
import sd79.enums.TodoType;
import sd79.model.Coupon;
import sd79.service.CouponService;
import sd79.utils.CloudinaryUpload;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/${api.version}/coupon")
@Tag(name = "Coupon Controller", description = "Manage adding, editing, and deleting product coupon")
@RequiredArgsConstructor
public class CouponController {

    private static final Logger log = LoggerFactory.getLogger(CouponController.class);
    private final CouponService couponService;
    private final CloudinaryUpload cloudinaryUpload;

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
    public ResponseData<?> addCoupon(@Valid @RequestBody CouponRequest couponRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Validation errors", formatValidationErrors(bindingResult));
        }
        return new ResponseData<>(HttpStatus.CREATED.value(), "Coupon created successfully", couponService.createCoupon(couponRequest));
    }

    // Cập nhật coupon
    @Operation(
            summary = "Update Coupon",
            description = "Update coupon into database"
    )
    @PutMapping("/update/{id}")
    public ResponseData<?> updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponRequest couponRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Validation errors", formatValidationErrors(bindingResult));
        }
        return new ResponseData<>(HttpStatus.OK.value(), "Coupon updated successfully", couponService.updateCoupon(id, couponRequest));
    }

    // Xóa coupon
    @Operation(
            summary = "Delete Coupon",
            description = "Set is delete of coupon to true and hide it from view"
    )
    @DeleteMapping("/delete/{id}")
    public ResponseData<?> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Coupon deleted successfully");
    }

    @GetMapping("/searchKeywordAndDate")
    public ResponseData<?> searchKeywordAndDate(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate,
            @RequestParam(value = "discountType", required = false) String discountTypeStr,
            @RequestParam(value = "type", required = false) String typeStr,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            @RequestParam(value = "sort", defaultValue = "startDate") String sort,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {

        TodoDiscountType discountType = (discountTypeStr != null) ? TodoDiscountType.valueOf(discountTypeStr.toUpperCase()) : null;
        TodoType type = (typeStr != null) ? TodoType.valueOf(typeStr.toUpperCase()) : null;
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Sort sortBy = Sort.by(sortDirection, sort);
        Pageable pageable = PageRequest.of(page, size, sortBy);
        Page<CouponResponse> results = couponService.findByKeywordAndDate(keyword, startDate, endDate, discountType, type, status, pageable);
        Map<String, Object> response = new HashMap<>();
        response.put("content", results.getContent());
        response.put("totalPages", results.getTotalPages());
        response.put("totalElements", results.getTotalElements());
        return new ResponseData<>(HttpStatus.OK.value(), "List coupon", response);
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseData<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Validation failed", formatValidationErrors(ex.getBindingResult()));
    }

    private Map<String, String> formatValidationErrors(BindingResult bindingResult) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return errors;
    }

    @PostMapping("/upload")
    public ResponseData<?> uploadFile(@ModelAttribute CouponImageReq request) {
        this.couponService.addCouponImage(request);
        log.info("File name: {}", request.getImages().getOriginalFilename());
        return new ResponseData<>(HttpStatus.CREATED.value(), "Successfully added coupon images", 200);
    }
}
