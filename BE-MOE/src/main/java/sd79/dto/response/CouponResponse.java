package sd79.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import sd79.enums.TodoDiscountType;
import sd79.enums.TodoType;
import sd79.model.CouponShare;
import sd79.model.Customer;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Builder
public class CouponResponse {
    private Long id;
    private String code; // ma
    private String name; // ten
    private TodoType type; // kieu cong khai hay ca nhan
    private BigDecimal discountValue;
    private TodoDiscountType discountType; // kieu giam gia % hay tien
    private BigDecimal maxValue;
    private Integer quantity; // so luong phieu giam gia su dung
    private Integer usageCount;
    private BigDecimal conditions;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm")
    private Date startDate; // ngay bat dau
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm")
    private Date endDate; // ngay ket thuc
    private String status; //trang thai
    private String description;
    private String imageUrl;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<Customer> customers;

}
