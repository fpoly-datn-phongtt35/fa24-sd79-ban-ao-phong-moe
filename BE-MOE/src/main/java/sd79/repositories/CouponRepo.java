package sd79.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.dto.response.CouponResponse;
import sd79.enums.TodoDiscountType;
import sd79.enums.TodoType;
import sd79.model.Coupon;

import java.util.Date;
import java.util.List;

@Repository
public interface CouponRepo extends JpaRepository<Coupon, Long> {
    @Query("SELECT COUNT(*) > 0 FROM Coupon c WHERE c.code = :code")
    boolean existsCouponByAttribute(String code);


//    List<Coupon> findAllByStatusAndIsDeleted(String status, Boolean isDeleted);
//    @Query("SELECT c FROM Coupon c JOIN c.couponShares cs WHERE cs.customer.id = :customerId AND c.isDeleted = false")
//    List<Coupon> findAllByCustomerId(@Param("customerId") Long customerId);
}
