package sd79.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.enums.Gender;
import sd79.model.Customer;

import java.util.Date;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {



    @Query("SELECT c FROM Customer c " +
            "WHERE (:keyword IS NULL OR c.firstName LIKE %:keyword% " +
            "OR c.lastName LIKE %:keyword% " +
            "OR c.phoneNumber  LIKE %:keyword%) " +
            "AND (:gender IS NULL OR c.gender LIKE %:gender%) " +
            "AND (:dateOfBirth IS NULL OR Date(c.dateOfBirth) = :dateOfBirth)")
    Page<Customer> searchCustomers(@Param("keyword") String keyword,
                                   @Param("gender") Gender gender,
                                   @Param("dateOfBirth") Date dateOfBirth,
                                   Pageable pageable);




}

