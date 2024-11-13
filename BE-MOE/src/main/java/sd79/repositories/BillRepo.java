package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sd79.model.Bill;
import sd79.model.Coupon;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepo extends JpaRepository<Bill, Long> {
    Optional<Bill> findByCode(String code);

    @Query("SELECT c.name, c.discountValue, c.discountType, c.conditions, c.maxValue " +
            "FROM Bill b JOIN b.coupon c WHERE b.id = :billId")
    List<Coupon> getCouponDetailsByCouponId(Long billId);


}
