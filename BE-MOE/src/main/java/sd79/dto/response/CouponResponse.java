package sd79.dto.response;

import com.example.utils.TodoDiscountType;
import lombok.Builder;
import lombok.Getter;
import sd79.utils.TodoType;

import java.util.Date;

@Getter
@Builder
public class CouponResponse {
    private String code; // ma
    private String name; // ten
    private TodoType type; // kieu cong khai hay ca nhan
    private TodoDiscountType discountType; // kieu giam gia % hay tien
    private Integer quantity; // so luong phieu giam gia su dung
    //    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private Date startDate; // ngay bat dau
    //    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private Date endDate; // ngay ket thuc
    private String status; //trang thai
}
