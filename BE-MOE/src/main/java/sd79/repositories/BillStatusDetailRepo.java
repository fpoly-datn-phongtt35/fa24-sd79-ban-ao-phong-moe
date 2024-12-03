package sd79.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.dto.response.bills.BillStatusDetailResponse;
import sd79.model.Bill;
import sd79.model.BillStatus;
import sd79.model.BillStatusDetail;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillStatusDetailRepo extends JpaRepository<BillStatusDetail, Long> {
    boolean existsByBillAndBillStatus(Bill bill, BillStatus billStatus);
    long countByBillAndBillStatus(Bill bill, BillStatus billStatus);
    Optional<BillStatusDetail> findTopByBillOrderByIdDesc(Bill bill);
}
