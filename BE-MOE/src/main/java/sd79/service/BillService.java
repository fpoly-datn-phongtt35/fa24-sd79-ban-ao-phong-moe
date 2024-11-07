package sd79.service;

import sd79.dto.requests.BillDetailRequest;
import sd79.dto.requests.BillRequest;
import sd79.dto.response.bills.BillCouponResponse;
import sd79.dto.response.bills.BillDetailResponse;
import sd79.dto.response.bills.BillResponse;
import sd79.model.BillStatus;
import sd79.model.Coupon;
import sd79.model.Customer;

import java.math.BigDecimal;
import java.util.List;

public interface BillService {
    //them lan 1
    List<BillResponse> getAllBill();
    List<BillResponse> getAllBills();
    BillResponse getBillId(Long id);
    long storeBill(BillRequest billRequest);
    void deleteBill(long id);
    //them lan 2
    List<BillDetailResponse> getAllProducts(long billId);
    long storeProduct(BillDetailRequest billDetailRequest);
    void deleteBillDetail(long billDetailId);
    //them lan 3
    List<Customer> getAllCustomers(long billId);
    long storeCustomer(Long billId, Long customerId);
    long deleteCustomer(long billId);
    //them lan 4
    List<BillCouponResponse> getAllCoupons(long billId);
    long storeCoupon(Long billId, Long couponId);
    long deleteCoupon(long billId);
    //them lan cuoi
    long storePay(BillRequest billRequest, List<BillDetailRequest> billDetailRequests);
    //thanh toan
}
