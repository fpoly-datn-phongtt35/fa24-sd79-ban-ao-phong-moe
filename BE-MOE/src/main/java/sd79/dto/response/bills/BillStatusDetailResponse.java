package sd79.dto.response.bills;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillStatusDetailResponse {
    private Long bill;
    private Integer billStatus;
    private String note;

}
