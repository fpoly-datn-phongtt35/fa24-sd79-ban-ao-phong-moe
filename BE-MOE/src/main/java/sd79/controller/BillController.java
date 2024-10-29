package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.BillDetailRequest;
import sd79.dto.requests.BillRequest;
import sd79.dto.requests.CouponRequest;
import sd79.dto.requests.common.BillParamFilter;
import sd79.dto.requests.common.CouponParamFilter;
import sd79.dto.requests.common.ProductParamFilter;
import sd79.dto.requests.productRequests.BillStoreRequest;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.ResponseData;
import sd79.dto.response.bills.ProductResponse;
import sd79.model.BillDetail;
import sd79.service.BillService;

import java.util.List;

@RestController
@RequestMapping("api/${api.version}/bill")
@Tag(name = "Bill Controller", description = "Quản lý thêm, sửa, xóa hóa đơn")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    //them lan 1
    @Operation(summary = "Thêm hóa đơn với chỉ mã", description = "Thêm hóa đơn chỉ với mã mà không cần thông tin khác")
    @PostMapping("/storeBill")
    public ResponseData<?> addBill(@Valid @RequestBody BillRequest billRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Lỗi xác thực", bindingResult.getFieldErrors());
        }
        long billId = billService.storeBill(billRequest);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Thêm mới hóa đơn với mã thành công", billId);
    }

    //them lan 2
    @Operation(summary = "Thêm sản phẩm vào hóa đơn", description = "Thêm sản phẩm vào hóa đơn chi tiết ")
    @PostMapping("/storeProduct")
    public ResponseData<?> addProduct(@Valid @RequestBody BillDetailRequest billDetailRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Lỗi xác thực", bindingResult.getFieldErrors());
        }
        long billId = billService.storeProduct(billDetailRequest);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Thêm mới sản phẩm vào hdct thành công", billId);
    }

    @Operation(summary = "Xóa sản phẩm khỏi hóa đơn", description = "Xóa sản phẩm khỏi chi tiết hóa đơn")
    @DeleteMapping("/deleteProduct/{billDetailId}")
    public ResponseData<?> deleteProduct(@PathVariable long billDetailId) {
        billService.deleteBillDetail(billDetailId);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Xóa sản phẩm khỏi hóa đơn thành công");
    }

    //them lan 3
    @Operation(summary = "Thêm khách hàng vào hóa đơn", description = "Thêm khách hàng vào hóa đơn hiện có")
    @PostMapping("/addCustomer")
    public ResponseData<?> addCustomer(@RequestParam Long billId, @RequestParam Long customerId) {
        long updatedBillId = billService.storeCustomer(billId, customerId);
        return new ResponseData<>(HttpStatus.OK.value(), "Thêm khách hàng vào hóa đơn thành công", updatedBillId);
    }

    //them lan 4
    @Operation(summary = "Thêm mã giảm giá vào hóa đơn", description = "Thêm mã giảm giá vào hóa đơn hiện có")
    @PostMapping("/addCoupon")
    public ResponseData<?> addCoupon(@RequestParam Long billId, @RequestParam Long couponId) {
        long updatedBillId = billService.storeCoupon(billId, couponId);
        return new ResponseData<>(HttpStatus.OK.value(), "Thêm mã giảm giá vào hóa đơn thành công", updatedBillId);
    }

    //them cuoi cung
    @Operation(summary = "Thêm mới hóa đơn", description = "Thêm hóa đơn và các chi tiết hóa đơn vào cơ sở dữ liệu")
    @PostMapping("/storePay")
    public ResponseData<?> addPay(@Valid @RequestBody BillStoreRequest billStoreRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Lỗi xác thực", bindingResult.getFieldErrors());
        }
        BillRequest billRequest = billStoreRequest.getBillRequest();
        List<BillDetailRequest> billDetails = billStoreRequest.getBillDetails();
        long billId = billService.storePay(billRequest, billDetails);

        return new ResponseData<>(HttpStatus.CREATED.value(), "Thêm mới hóa đơn thành công", billId);
    }


}
