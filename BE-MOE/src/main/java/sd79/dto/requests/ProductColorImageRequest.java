package sd79.dto.requests;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ProductColorImageRequest {
    private int color;
    private String[] imageUrl;
}
