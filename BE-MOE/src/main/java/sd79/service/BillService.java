package sd79.service;

import sd79.dto.requests.BillDetailRequest;
import sd79.dto.requests.BillRequest;
import sd79.dto.requests.common.BillParamFilter;
import sd79.dto.requests.common.ProductParamFilter;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.bills.ProductResponse;

import java.util.List;

public interface BillService {
    //them lan 1
    long storeBill(BillRequest billRequest);
    //them lan 2
    long storeProduct(BillDetailRequest billDetailRequest);
    void deleteBillDetail(long billDetailId);
    //them lan 3
    long storeCustomer(Long billId, Long customerId);
    //them lan 4
    long storeCoupon(Long billId, Long couponId);
    //them lan cuoi
    long storePay(BillRequest billRequest, List<BillDetailRequest> billDetailRequests);
}
