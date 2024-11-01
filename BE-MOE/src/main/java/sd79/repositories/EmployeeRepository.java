package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;


import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.dto.requests.EmployeeReq;
import sd79.model.Coupon;
import sd79.model.Employee;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
//
//    @Query("SELECT e FROM employees e WHERE e.phone_number = :phone_number")
//    Optional<Employee> findByPhone_number(String phone_number);

    @Query("from employees where id = :id")
    Optional<Employee> findByIdEmp(Integer id);

    @Query("FROM employees e WHERE (CONCAT(e.first_name, ' ', e.last_name) LIKE %:keyword%) " +
            "OR (e.phone_number LIKE :phone_number)")
    List<Employee> findByKeywordAndPhone(@Param("keyword") String keyword,
                                            @Param("phone_number") String phoneNumber);


}
