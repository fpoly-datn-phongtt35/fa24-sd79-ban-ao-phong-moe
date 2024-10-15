package sd79.dto.requests.productRequests;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductColorImageRequest {
    private int color;
    private String[] imageUrl;
}
