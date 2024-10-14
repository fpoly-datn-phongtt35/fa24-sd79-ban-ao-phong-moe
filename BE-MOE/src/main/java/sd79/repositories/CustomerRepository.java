package sd79.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.model.Customer;

import java.util.Date;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {


    @Query("SELECT c FROM Customer c " +
            "WHERE (:firstName IS NULL OR c.firstName LIKE %:firstName%) " +
            "AND (:lastName IS NULL OR c.lastName LIKE %:lastName%) " +
            "AND (:phoneNumber IS NULL OR c.phoneNumber LIKE %:phoneNumber%) " +
            "AND (:gender IS NULL OR c.gender = :gender) " +
            "AND (:startDate IS NULL OR c.dateOfBirth BETWEEN :startDate AND :endDate)")
    Page<Customer> searchCustomers(@Param("firstName") Date firstName,
                                   @Param("lastName") Date lastName,
                                   @Param("phoneNumber") String phoneNumber,
//                                   @Param("gender") String gender,
                                   @Param("startDate") String startDate,
                                   @Param("endDate") String endDate,
                                   Pageable pageable);


    @Query("FROM Customer c " +
            "WHERE (c.firstName LIKE %:keyword% OR c.lastName LIKE %:keyword% OR c.phoneNumber LIKE %:keyword%) " +
            "OR (c.dateOfBirth BETWEEN :startDate AND :endDate)")
    List<Customer> findByKeywordAndDate(@Param("keyword") String keyword,
                                        @Param("startDate") Date startDate,
                                        @Param("endDate") Date endDate);
}
