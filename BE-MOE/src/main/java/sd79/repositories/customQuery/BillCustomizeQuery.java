package sd79.repositories.customQuery;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Component;
import sd79.dto.response.bills.BillCouponResponse;
import sd79.dto.response.bills.BillResponse;
import sd79.model.Bill;
import sd79.model.Coupon;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BillCustomizeQuery {

    @PersistenceContext
    private EntityManager entityManager;

    public List<BillResponse> getAllBills() {
        String sql = "SELECT b FROM Bill b WHERE b.billStatus.id = 1";
        TypedQuery<Bill> query = entityManager.createQuery(sql, Bill.class);
        List<Bill> bills = query.getResultList();
        return bills.stream().map(this::convertToBillResponse).collect(Collectors.toList());
    }

    private BillResponse convertToBillResponse(Bill bill) {
        return BillResponse.builder()
                .id(bill.getId())
                .code(bill.getCode())
                .customer(bill.getCustomer())
                .coupon(bill.getCoupon() != null ? convertToBillCouponResponse(bill.getCoupon()) : null)
                .build();
    }

    private BillCouponResponse convertToBillCouponResponse(Coupon coupon) {
        return BillCouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .discountValue(coupon.getDiscountValue())
                .discountType(coupon.getDiscountType())
                .maxValue(coupon.getMaxValue())
                .conditions(coupon.getConditions())
                .build();
    }
}
