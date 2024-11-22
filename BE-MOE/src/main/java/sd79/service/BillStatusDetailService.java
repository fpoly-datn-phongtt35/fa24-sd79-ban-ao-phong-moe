package sd79.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sd79.dto.requests.BillStatusDetailRequest;
import sd79.dto.response.bills.BillStatusDetailResponse;
import sd79.model.BillStatusDetail;

import java.util.List;
import java.util.Optional;

public interface BillStatusDetailService {
    List<BillStatusDetailResponse> getBillStatusDetailsByBillId(Long billId);
    long addBillStatusDetail(BillStatusDetailRequest request);
    long addBillStatusDetailV2(BillStatusDetailRequest request);
    Page<Integer> getPreviousBillStatus(Long billId, Pageable pageable);
}
