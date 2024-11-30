package sd79.dto.requests.common;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Builder
public class BillListParamFilter {
    private Integer pageNo = 1;

    private Integer pageSize = 5;

    private String keyword;

    private Integer status;

    private Date startDate;

    private Date endDate;

    private BigDecimal minTotal ;

    private BigDecimal maxTotal ;
}
