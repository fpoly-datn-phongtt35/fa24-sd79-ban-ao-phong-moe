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


    @Query("SELECT c FROM Coupon c WHERE c.type = 'PUBLIC' AND c.isDeleted = false " +
            "AND c.startDate <= CURRENT_DATE AND (c.endDate IS NULL OR c.endDate >= CURRENT_DATE)")
    List<Coupon> findAllPublicCouponsWithStartStatus();

    @Query("SELECT c FROM Coupon c LEFT JOIN c.couponShares cs ON cs.customer.id = :customerId " +
            "WHERE c.isDeleted = false AND ((c.type = 'PUBLIC' " +
            "AND c.startDate <= CURRENT_DATE AND (c.endDate IS NULL OR c.endDate >= CURRENT_DATE)) " +
            "OR (cs.customer.id = :customerId AND c.startDate <= CURRENT_DATE AND (c.endDate IS NULL OR c.endDate >= CURRENT_DATE)))")
    List<Coupon> findAllCustomerAndPublicCouponsWithStartStatus(@Param("customerId") Long customerId);

}
