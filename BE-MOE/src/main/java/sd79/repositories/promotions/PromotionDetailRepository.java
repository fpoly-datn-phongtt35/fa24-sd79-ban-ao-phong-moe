package sd79.repositories.promotions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import sd79.model.PromotionDetail;

import java.util.Optional;

@Repository
public interface PromotionDetailRepository extends JpaRepository<PromotionDetail, Integer> {
    @Modifying
    @Transactional
    @Query("DELETE FROM PromotionDetail pd WHERE pd.promotion.id = :promotionId")
    void deleteByPromotionId(@Param("promotionId") Integer promotionId);

    @Query("FROM PromotionDetail  WHERE product.id = :productId AND CURRENT_TIMESTAMP BETWEEN promotion.startDate AND promotion.endDate")
    PromotionDetail findByProductId(Long productId);

    @Query("SELECT pd FROM PromotionDetail pd " +
            "WHERE pd.product.id = :productId " +
            "AND CURRENT_TIMESTAMP BETWEEN pd.promotion.startDate AND pd.promotion.endDate")
    Optional<PromotionDetail> findActivePromotionByProductId(@Param("productId") Long productId);

}
