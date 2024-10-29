package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sd79.model.ProductPromotion;

public interface PromotionProductRepo extends JpaRepository<ProductPromotion, Integer> {
}
