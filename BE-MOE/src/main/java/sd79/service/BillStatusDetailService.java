package sd79.service;

import sd79.dto.requests.BillStatusDetailRequest;
import sd79.dto.response.bills.BillStatusDetailResponse;
import sd79.model.BillStatusDetail;

import java.util.List;

public interface BillStatusDetailService {
    List<BillStatusDetailResponse> getBillStatusDetailsByBillId(Long billId);
    long addBillStatusDetail(BillStatusDetailRequest request);
}
