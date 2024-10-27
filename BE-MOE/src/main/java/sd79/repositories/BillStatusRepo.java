package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.BillStatus;

@Repository
public interface BillStatusRepo extends JpaRepository<BillStatus, Integer> {
}
