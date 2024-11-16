package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.BillStatusDetail;

@Repository
public interface BillStatusDetailRepo extends JpaRepository<BillStatusDetail, Long> {
}
