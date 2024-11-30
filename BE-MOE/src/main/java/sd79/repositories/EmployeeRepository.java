package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;


import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.dto.requests.EmployeeReq;
import sd79.model.Coupon;
import sd79.model.Employee;
import sd79.model.User;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUser(User user);


    @Query("from employees where id = :id")
    Optional<Employee> findByIdEmp(Long id);

    @Query("FROM employees e WHERE (CONCAT(e.first_name, ' ', e.last_name) LIKE %:keyword%) " +
            "OR (e.phone_number LIKE :phone_number)")
    List<Employee> findByKeywordAndPhone(@Param("keyword") String keyword,
                                            @Param("phone_number") String phoneNumber);

    @Query("SELECT COUNT(*) > 0 FROM User u WHERE u.username = :username")
    boolean existsByUsername(String username);

    @Query("SELECT COUNT(*) > 0 FROM User u WHERE u.email = :email")
    boolean existsByEmail(String email);

    @Query("SELECT COUNT(*) > 0 FROM Customer c WHERE c.phoneNumber = :phoneNumber")
    boolean existsByPhoneNumber(String phoneNumber);
}
