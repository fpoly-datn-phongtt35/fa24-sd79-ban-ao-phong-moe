package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sd79.model.Employee;
import sd79.model.Positions;

public interface PositionsRepository extends JpaRepository<Positions,Integer> {
}
