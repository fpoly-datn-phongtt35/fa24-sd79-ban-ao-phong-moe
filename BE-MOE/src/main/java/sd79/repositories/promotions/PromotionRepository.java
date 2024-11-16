package sd79.repositories.promotions;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.model.Promotion;

import java.util.Date;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
//    @Query("SELECT COUNT(*) > 0 FROM Promotion p WHERE p.code = :code")
//    boolean existsPromotionByAttribute(String code);


    @Query("SELECT p FROM Promotion p " +
            "WHERE (p.startDate BETWEEN :startDate AND :endDate) " +
            "OR p.name LIKE %:keyword% " + // Searching by username
            "OR p.code LIKE %:keyword% " +
            "AND (:name IS NULL OR p.name LIKE %:name%) ")
    Page<Promotion> searchPromotions(@Param("startDate") Date startDate,
                                     @Param("endDate") Date endDate,
                                     @Param("name") String name,
                                     Pageable pageable);


    @Query("SELECT p FROM Promotion p " +
            "WHERE (:keyword IS NULL OR p.name LIKE %:keyword%) " +
            "AND (:startDate IS NULL OR p.startDate >= :startDate) " +
            "AND (:endDate IS NULL OR p.endDate <= :endDate) " +
            "AND ((:status IS NULL) " +
            "     OR (:status = 'C.Bắt đầu' AND p.startDate > CURRENT_DATE) " +
            "     OR (:status = 'Bắt đầu' AND p.startDate <= CURRENT_DATE AND p.endDate >= CURRENT_DATE) " +
            "     OR (:status = 'Kết thúc' AND p.endDate < CURRENT_DATE))")
    Page<Promotion> findByKeywordAndDate(@Param("keyword") String keyword,
                                         @Param("startDate") Date startDate,
                                         @Param("endDate") Date endDate,
                                         @Param("status") String status,
                                         Pageable pageable);

    boolean existsByName(String name);
    boolean existsByCode(String code);
    boolean existsByNameAndIdNot(String name, Integer id);
    boolean existsByCodeAndIdNot(String code, Integer id);


}
