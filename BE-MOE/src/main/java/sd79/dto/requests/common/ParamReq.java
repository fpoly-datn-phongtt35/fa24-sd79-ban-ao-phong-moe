package sd79.dto.requests.common;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ParamReq {
    private String keyword;
    private String status;
}
