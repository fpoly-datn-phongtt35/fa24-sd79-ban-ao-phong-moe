package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.CouponImage;

@Repository
public interface CouponImageRepo extends JpaRepository<CouponImage, Integer> {
}
