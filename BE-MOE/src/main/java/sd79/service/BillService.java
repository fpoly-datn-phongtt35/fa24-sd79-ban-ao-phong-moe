package sd79.service;

import sd79.dto.requests.BillDetailRequest;
import sd79.dto.requests.BillRequest;
import sd79.model.BillDetail;

import java.util.List;

public interface BillService {
    long storeBill(BillRequest billRequest, List<BillDetailRequest> billDetailRequests);
}
