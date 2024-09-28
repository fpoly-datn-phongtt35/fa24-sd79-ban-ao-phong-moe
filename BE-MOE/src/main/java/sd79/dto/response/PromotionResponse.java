package sd79.dto.response;

import java.math.BigDecimal;
import java.util.Date;

public class PromotionResponse {
    private Long id;
    private String name;
    private String promotionType;
    private BigDecimal promotionValue;
    private Date startDate;
    private Date endDate;
    private String description;
}
