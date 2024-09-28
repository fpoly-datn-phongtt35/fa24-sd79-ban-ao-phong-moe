package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sd79.model.Employee;


public interface EmployeeRepository extends JpaRepository<Employee,Integer> {

//    List<EmployeeRequests> getAllEmployee();
}
