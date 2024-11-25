package sd79.dto.requests.common;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
public class StatisticalParamFilter {
    private Date startDate;
    private Date endDate;
    private String granularity;
    private Integer pageNo = 0;
    private Integer pageSize = 3;
}
