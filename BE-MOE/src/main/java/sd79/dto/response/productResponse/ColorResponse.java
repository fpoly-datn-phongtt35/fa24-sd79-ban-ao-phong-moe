package sd79.dto.response.productResponse;

import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Getter
@Builder
public class ColorResponse {
    private Integer id;
    private String name;
    private String hex_code;
    private String createdBy;
    private Date createdAt;
    private Date updatedAt;
}
