package sd79.repositories.promotions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import sd79.model.PromotionDetail;

@Repository
public interface PromotionDetailRepository extends JpaRepository<PromotionDetail, Integer> {
    @Modifying
    @Transactional
    @Query("DELETE FROM PromotionDetail pd WHERE pd.promotion.id = :promotionId")
    void deleteByPromotionId(@Param("promotionId") Integer promotionId);

}
