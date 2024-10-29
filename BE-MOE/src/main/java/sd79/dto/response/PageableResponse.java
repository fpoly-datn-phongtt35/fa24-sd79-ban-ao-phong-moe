/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
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
