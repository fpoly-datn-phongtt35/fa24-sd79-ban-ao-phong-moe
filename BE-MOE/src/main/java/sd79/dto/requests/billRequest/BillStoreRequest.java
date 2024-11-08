package sd79.dto.requests.billRequest;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class BillStoreRequest {
    private BillRequest billRequest; // This must not be null
    private List<BillDetailRequest> billDetails; // This must not be null and should contain data
}
