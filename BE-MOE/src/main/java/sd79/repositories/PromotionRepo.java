package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.Promotion;

@Repository
public interface PromotionRepo extends JpaRepository<Promotion, Integer> {

}
