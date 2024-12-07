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
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUserId(Long userId);

    @Query("SELECT c FROM Customer c " +
            "JOIN c.user u " +
            "WHERE (:keyword IS NULL OR " +
            "      c.firstName LIKE %:keyword% " +
            "      OR c.lastName LIKE %:keyword% " +
            "      OR u.username LIKE %:keyword% " +
            "      OR u.email LIKE %:keyword% " +
            "      OR c.phoneNumber LIKE %:keyword% " +
            "      OR (CONCAT(c.firstName, ' ', c.lastName) LIKE %:keyword%) " + // Handle "firstName lastName"
            "      OR (CONCAT(c.lastName, ' ', c.firstName) LIKE %:keyword%)) " + // Handle "lastName firstName"
            "AND (:gender IS NULL OR c.gender LIKE %:gender%) " +
            "AND (:dateOfBirth IS NULL OR Date(c.dateOfBirth) = :dateOfBirth)")
    Page<Customer> searchCustomers(@Param("keyword") String keyword,
                                   @Param("gender") Gender gender,
                                   @Param("dateOfBirth") Date dateOfBirth,
                                   Pageable pageable);


    @Query("SELECT COUNT(*) > 0 FROM User u WHERE u.username = :username")
    boolean existsByUsername(String username);

    @Query("SELECT COUNT(*) > 0 FROM User u WHERE u.email = :email")
    boolean existsByEmail(String email);

    @Query("SELECT COUNT(*) > 0 FROM Customer c WHERE c.phoneNumber = :phoneNumber")
    boolean existsByPhoneNumber(String phoneNumber);




}

