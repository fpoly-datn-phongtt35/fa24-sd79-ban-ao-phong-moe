package sd79.repositories.promotions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.Promotion;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
}
