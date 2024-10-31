package sd79.service;

import sd79.dto.requests.BillDetailRequest;
import sd79.dto.requests.BillRequest;
import sd79.dto.requests.common.BillParamFilter;
import sd79.dto.requests.common.ProductParamFilter;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.bills.BillDetailRespone;
import sd79.dto.response.bills.BillRespone;
import sd79.dto.response.bills.ProductResponse;

import java.util.List;

public interface BillService {
    //them lan 1
    List<BillRespone> getAllBills();
    long storeBill(BillRequest billRequest);
    void deleteBill(long id);
    //them lan 2
    List<BillDetailRespone> getAllProducts(long billId);
    long storeProduct(BillDetailRequest billDetailRequest);
    void deleteBillDetail(long billDetailId);
    //them lan 3
    long storeCustomer(Long billId, Long customerId);
    long deleteCustomer(long billId);
    //them lan 4
    long storeCoupon(Long billId, Long couponId);
    long deleteCoupon(long billId);
    //them lan cuoi
    long storePay(BillRequest billRequest, List<BillDetailRequest> billDetailRequests);
}
