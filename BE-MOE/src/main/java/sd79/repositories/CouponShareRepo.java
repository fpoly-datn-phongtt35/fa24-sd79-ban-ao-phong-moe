package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.CouponShare;

@Repository
public interface CouponShareRepo extends JpaRepository<CouponShare, Integer> {
}
