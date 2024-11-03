package sd79.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.model.Promotion;

import java.util.Date;

@Repository
public interface PromotionRepo extends JpaRepository<Promotion, Integer> {
//    @Query("SELECT p FROM Promotion p " +
//            "WHERE (p.startDate BETWEEN :startDate AND :endDate) " +
//            "AND (:name IS NULL OR p.name LIKE %:name%) ")
//    Page<Promotion> searchPromotions(@Param("startDate") Date startDate,
//                               @Param("endDate") Date endDate,
//                               @Param("name") String name,
//                               Pageable pageable);
//
//
//    @Query("FROM Promotion p " +
//            "WHERE (p.name LIKE %:keyword% ) " +
//            "OR (Date(p.startDate) BETWEEN :startDate AND :endDate) " +
//            "AND (Date(p.endDate) BETWEEN :startDate AND :endDate) " +
//            "OR ((:status = 'C.Bắt đầu' AND p.startDate > CURRENT_DATE) " +
//            "OR (:status = 'Bắt đầu' AND p.startDate <= CURRENT_DATE AND p.endDate >= CURRENT_DATE) " +
//            "OR (:status = 'Kết thúc' AND p.endDate < CURRENT_DATE))")
//    Page<Promotion> findByKeywordAndDate(@Param("keyword") String keyword,
//                                      @Param("startDate") Date startDate,
//                                      @Param("endDate") Date endDate,
//                                      @Param("status") String status,
//                                      Pageable pageable);
//
}
