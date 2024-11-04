package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.CouponImageReq;
import sd79.dto.requests.CouponRequest;
import sd79.dto.requests.common.CouponParamFilter;
import sd79.dto.response.ResponseData;
import sd79.model.Coupon;
import sd79.model.Customer;
import sd79.service.CouponService;
import sd79.utils.CloudinaryUtils;

import java.util.List;

@RestController
@RequestMapping("api/${api.version}/coupon")
@Tag(name = "Coupon Controller", description = "Quản lý thêm, sửa, xóa phiếu giảm giá sản phẩm")
@RequiredArgsConstructor
public class CouponController {

    private static final Logger log = LoggerFactory.getLogger(CouponController.class);
    private final CouponService couponService;
    private final CloudinaryUtils cloudinaryUpload;

    // Lấy danh sách phiếu giảm giá
    @Operation(
            summary = "Lấy danh sách phiếu giảm giá",
            description = "Lấy tất cả phiếu giảm giá từ cơ sở dữ liệu"
    )
    @GetMapping
    public ResponseData<?> getAllCoupons(CouponParamFilter param) {
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy danh sách phiếu giảm giá thành công", this.couponService.getAllCoupon(param));
    }

    @Operation(
            summary = "Lấy danh sách phiếu giảm giá trạng thái đang diễn ra",
            description = "Lấy tất cả phiếu giảm giá trạng thái đang diễn ra từ cơ sở dữ liệu"
    )
    @GetMapping("/getAllCouponDate")
    public ResponseData<?> getAllCouponDate(CouponParamFilter param) {
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy danh sách phiếu giảm trạng thái đang diễn ra giá thành công", this.couponService.getAllCouponDate(param));
    }

    @Operation(
            summary = "Lấy danh sách phiếu giảm giá cá nhân",
            description = "Lấy tất cả phiếu giảm giá tcá nhâ từ cơ sở dữ liệu"
    )
    @GetMapping("/getAllCouponDatePersonal")
    public ResponseData<?> getAllCouponDatePersonal(CouponParamFilter param) {
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy danh sách phiếu giảm cá nhân thành công", this.couponService.getAllCouponDatePersonal(param));
    }

    // Lấy thông tin phiếu giảm giá theo ID
    @GetMapping("/detail/{id}")
    public ResponseData<?> getCouponById(@PathVariable Long id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Chi tiết phiếu giảm giá", couponService.getCouponById(id));
    }

    // Thêm mới phiếu giảm giá
    @Operation(
            summary = "Thêm mới phiếu giảm giá",
            description = "Thêm phiếu giảm giá vào cơ sở dữ liệu"
    )
    @PostMapping("/store")
    public ResponseData<?> addCoupon(@Valid @RequestBody CouponRequest couponRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Lỗi xác thực", bindingResult.getFieldErrors());
        }
        return new ResponseData<>(HttpStatus.CREATED.value(), "Thêm mới phiếu giảm giá thành công", couponService.storeCoupon(couponRequest));
    }

    // Cập nhật  phiếu giảm giá
    @Operation(
            summary = "Cập nhật phiếu giảm giá",
            description = "Cập nhật phiếu giảm giá vào cơ sở dữ liệu"
    )
    @PutMapping("/update/{id}")
    public ResponseData<?> updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponRequest couponRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Lỗi xác thực", bindingResult.getFieldErrors());
        }
        return new ResponseData<>(HttpStatus.OK.value(), "Cập nhật phiếu giảm giá thành công", couponService.updateCoupon(id, couponRequest));
    }

    // Xóa  phiếu giảm giá
    @Operation(
            summary = "Xóa phiếu giảm giá",
            description = "Đánh dấu phiếu giảm giá đã bị xóa và ẩn nó khỏi giao diện"
    )
    @DeleteMapping("/delete/{id}")
    public ResponseData<?> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Xóa phiếu giảm giá thành công");
    }

    // Tải hình ảnh phiếu giảm giá lên
    @PostMapping("/upload")
    public ResponseData<?> uploadFile(@ModelAttribute CouponImageReq request) {
        this.couponService.storeCouponImages(request);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Thêm hình ảnh phiếu giảm giá thành công");
    }

    // Xóa hình ảnh coupon
    @Operation(
            summary = "Xóa hình ảnh phiếu giảm giá",
            description = "Xóa hình ảnh phiếu giảm giá từ Cloudinary và xóa bản ghi khỏi cơ sở dữ liệu"
    )
    @DeleteMapping("/delete/images/{couponId}")
    public ResponseData<?> deleteCouponImage(@PathVariable Long couponId) {
        couponService.deleteCouponImage(couponId);
        return new ResponseData<>(HttpStatus.OK.value(), "Xóa hình ảnh phiếu giảm giá thành công");
    }

    // Gửi email phiếu giảm giá
    @Operation(
            summary = "Gửi email phiếu giảm giá",
            description = "Gửi email phiếu giảm giá cho khách hàng"
    )
    @PostMapping("/send/email")
    public ResponseData<?> sendEmail(@RequestParam Long couponId, @RequestParam Long customerId) {
        Coupon coupon = couponService.findCouponById(couponId);
        Customer customer = couponService.findCustomerById(customerId);
        couponService.sendCouponEmail(coupon, customer);
        return new ResponseData<>(HttpStatus.OK.value(), "Gửi email phiếu giảm giá thành công");
    }

//    @Operation(
//            summary = "Lấy danh sách khách hàng của một phiếu giảm giá",
//            description = "Lấy tất cả khách hàng liên kết với một phiếu giảm giá cụ thể từ cơ sở dữ liệu"
//    )
//    @GetMapping("/getAllCouponCustomers/{couponId}")
//    public ResponseData<?> getAllCouponCustomers(@PathVariable Long couponId) {
//        // Fetch all customers for the given coupon ID
//        List<Customer> customers = couponService.getAllCouponCustomers(couponId);
//
//        // Return the response with the customer list
//        return new ResponseData<>(HttpStatus.OK.value(), "Lấy danh sách khách hàng thành công", customers);
//    }

}
