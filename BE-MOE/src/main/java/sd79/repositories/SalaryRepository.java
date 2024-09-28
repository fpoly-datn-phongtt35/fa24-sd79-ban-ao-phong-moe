package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sd79.model.Employee;
import sd79.model.Salary;

public interface SalaryRepository extends JpaRepository<Salary,Integer> {
}
