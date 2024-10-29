package sd79.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.Date;
@Getter
@Builder
public class PromotionResponse {
    private Integer id;
    private String name;
    private BigDecimal promotionValue;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private Date startDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private Date endDate;
    private String description;
    private int productID;
    private BigDecimal promotionPrice;
}
