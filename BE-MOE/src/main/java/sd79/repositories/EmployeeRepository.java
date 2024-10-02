package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;


import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sd79.model.Employee;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query("SELECT e FROM employees e WHERE e.phone_number = :phone_number")
    Optional<Employee> findByPhone_number(String phone_number);

    @Query("from employees where id = :id")
    Optional<Employee> findByIdEmp(Integer id);

}
