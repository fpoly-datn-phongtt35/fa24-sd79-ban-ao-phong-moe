package sd79.dto.response.bills;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillStatusDetailResponse {
    private Long bill;
    private Integer billStatus;
    private String note;
    private Date createAt;
}
