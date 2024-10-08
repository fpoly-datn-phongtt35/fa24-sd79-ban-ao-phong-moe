package sd79.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PageableResponse {
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private int pageNumber;
    private Object content;
}
