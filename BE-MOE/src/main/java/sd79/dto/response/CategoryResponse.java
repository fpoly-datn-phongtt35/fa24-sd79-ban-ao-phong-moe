package sd79.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Getter
@Builder
public class CategoryResponse {
    private Integer id;
    private String name;
    private Long productCount;
    private String createdBy;
    private Date createdAt;
    private Date updatedAt;
}
