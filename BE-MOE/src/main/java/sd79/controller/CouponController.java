package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.CouponImageReq;
import sd79.dto.requests.CouponRequest;
import sd79.dto.requests.common.CouponParamFilter;
import sd79.dto.response.ResponseData;
import sd79.service.CouponService;
import sd79.utils.CloudinaryUtils;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/${api.version}/coupon")
@Tag(name = "Coupon Controller", description = "Manage adding, editing, and deleting product coupon")
@RequiredArgsConstructor
public class CouponController {

    private static final Logger log = LoggerFactory.getLogger(CouponController.class);
    private final CouponService couponService;
    private final CloudinaryUtils cloudinaryUpload;

    // Lấy danh sách coupon
    @Operation(
            summary = "Get Coupon",
            description = "Get all coupons from the database"
    )
    @GetMapping
    public ResponseData<?> getAllCoupons(CouponParamFilter param) {
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved coupon list", this.couponService.getAllCoupon(param));
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
        return new ResponseData<>(HttpStatus.CREATED.value(), "Coupon created successfully", couponService.storeCoupon(couponRequest));
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
        this.couponService.storeCouponImages(request);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Successfully added coupon images");
    }

    @Operation(
            summary = "Delete Coupon Image",
            description = "Delete a coupon image from Cloudinary and remove the record from the database"
    )
    @DeleteMapping("/delete/images/{couponId}")
    public ResponseData<?> deleteCouponImage(@PathVariable Long couponId) {
            couponService.deleteCouponImage(couponId);
            return new ResponseData<>(HttpStatus.OK.value(), "Coupon image deleted successfully");
    }

}
