package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.Bill;

@Repository
public interface BillRepo extends JpaRepository<Bill, Long> {
}
