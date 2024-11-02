package sd79.dto.requests.common;

import lombok.Builder;
import lombok.Getter;
@Getter
@Builder
public class PromotionParamFilter {
    private int pageNo;
    private int pageSize;

}
