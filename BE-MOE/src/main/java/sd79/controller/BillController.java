package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sd79.dto.requests.BillDetailRequest;
import sd79.dto.requests.BillRequest;
import sd79.dto.requests.CouponRequest;
import sd79.dto.requests.productRequests.BillStoreRequest;
import sd79.dto.response.ResponseData;
import sd79.model.BillDetail;
import sd79.service.BillService;

import java.util.List;

@RestController
@RequestMapping("api/${api.version}/bill")
@Tag(name = "Bill Controller", description = "Quản lý thêm, sửa, xóa hóa đơn")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @Operation(
            summary = "Thêm mới hóa đơn",
            description = "Thêm hóa đơn và các chi tiết hóa đơn vào cơ sở dữ liệu"
    )
    @PostMapping("/store")
    public ResponseData<?> addBill(@Valid @RequestBody BillStoreRequest billStoreRequest,
                                   BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Lỗi xác thực", bindingResult.getFieldErrors());
        }

        // Extract BillRequest and BillDetailRequest list from the wrapper DTO
        BillRequest billRequest = billStoreRequest.getBillRequest();
        List<BillDetailRequest> billDetails = billStoreRequest.getBillDetails();

        // Call the service to store the Bill and associated BillDetails
        long billId = billService.storeBill(billRequest, billDetails);

        return new ResponseData<>(HttpStatus.CREATED.value(), "Thêm mới hóa đơn thành công", billId);
    }


}
