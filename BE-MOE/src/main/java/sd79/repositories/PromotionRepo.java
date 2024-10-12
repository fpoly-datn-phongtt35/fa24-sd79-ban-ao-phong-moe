package sd79.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.model.Promotion;

import java.util.Date;
import java.util.List;

@Repository
public interface PromotionRepo extends JpaRepository<Promotion, Integer> {
    @Query("SELECT p FROM Promotion p " +
            "WHERE (p.startDate BETWEEN :startDate AND :endDate) " +
            "AND (:name IS NULL OR p.name LIKE %:name%) ")
    List<?> searchByNameAndDate(String name, Date startDate, Date endDate);
//    Page<Promotion> searchPromotions(@Param("startDate") Date startDate,
//                               @Param("endDate") Date endDate,
//                               @Param("name") String name,
//                               Pageable pageable);

}
