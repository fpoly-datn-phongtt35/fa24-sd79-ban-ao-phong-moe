package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sd79.model.Employee;
import sd79.model.Employee_address;

public interface Employee_addressRepository extends JpaRepository<Employee_address,Integer> {
}
