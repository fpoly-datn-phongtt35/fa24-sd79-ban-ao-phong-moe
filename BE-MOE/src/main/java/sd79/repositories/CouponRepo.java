package sd79.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.model.Coupon;

import java.util.Date;
import java.util.List;

@Repository
public interface CouponRepo extends JpaRepository<Coupon, Long> {

    @Query("SELECT c FROM Coupon c " +
            "WHERE (c.startDate BETWEEN :startDate AND :endDate) " +
            "AND (:name IS NULL OR c.name LIKE %:name%) " +
            "AND (:code IS NULL OR c.code LIKE %:code%)")
    Page<Coupon> searchCoupons(@Param("startDate") Date startDate,
                               @Param("endDate") Date endDate,
                               @Param("name") String name,
                               @Param("code") String code,
                               Pageable pageable);

    @Query("FROM Coupon c " +
            "WHERE (c.name LIKE %:keyword% OR c.code LIKE %:keyword%) " +
            "OR (c.startDate BETWEEN :startDate AND :endDate)")
    List<Coupon> findByKeywordAndDate(@Param("keyword") String keyword,
                                      @Param("startDate") Date startDate,
                                      @Param("endDate") Date endDate);
}
