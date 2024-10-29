package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.BillDetail;

@Repository
public interface BillDetailRepo extends JpaRepository<BillDetail, Long> {
}
