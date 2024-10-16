package sd79.dto.requests;

import lombok.Builder;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;
@Getter
@Builder
public class CouponImageReq {
    private Long couponID;
    private MultipartFile images;
}
