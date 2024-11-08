package sd79.dto.requests.productRequests;

import lombok.Getter;
import lombok.Setter;
import sd79.dto.requests.billRequest.BillDetailRequest;
import sd79.dto.requests.billRequest.BillRequest;

import java.util.List;

@Getter
@Setter
public class BillStoreRequest {
    private BillRequest billRequest;
    private List<BillDetailRequest> billDetails;
}
