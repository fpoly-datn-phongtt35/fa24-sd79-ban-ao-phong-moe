package sd79.service;

import sd79.dto.requests.BillDetailRequest;
import sd79.dto.requests.BillRequest;
import sd79.dto.requests.common.BillParamFilter;
import sd79.dto.requests.common.ProductParamFilter;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.bills.ProductResponse;

import java.util.List;

public interface BillService {
    long storeBill(BillRequest billRequest, List<BillDetailRequest> billDetailRequests);
    PageableResponse getAllBillProducts(BillParamFilter param);
}
