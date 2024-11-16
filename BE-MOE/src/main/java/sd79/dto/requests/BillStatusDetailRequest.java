package sd79.dto.requests;

import lombok.Builder;
import lombok.Getter;
import sd79.model.Bill;
import sd79.model.BillStatus;

@Getter
@Builder
public class BillStatusDetailRequest {
    private Long bill;
    private Integer billStatus;
    private String note;
    private Long userId;
}
