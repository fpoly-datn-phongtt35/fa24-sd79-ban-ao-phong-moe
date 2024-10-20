package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.Coupon;
import sd79.model.CouponShare;

import java.util.List;

@Repository
public interface CouponShareRepo extends JpaRepository<CouponShare, Long> {
    List<CouponShare> findByCoupon(Coupon coupon);
}
