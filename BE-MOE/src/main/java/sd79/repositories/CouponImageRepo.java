package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.CouponImage;

import java.util.Optional;

@Repository
public interface CouponImageRepo extends JpaRepository<CouponImage, Long> {
    Optional<CouponImage> findByCouponId(Long couponId);
}
