package sd79.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Getter
@Builder
public class SizeResponse {
    private Integer id;
    private String name;
    private float length;
    private float width;
    private float sleeve;
    private String createdBy;
    private Date createdAt;
    private Date updatedAt;
}
