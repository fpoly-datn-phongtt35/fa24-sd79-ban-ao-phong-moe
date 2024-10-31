package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.Bill;
import sd79.model.BillDetail;
import sd79.model.ProductDetail;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillDetailRepo extends JpaRepository<BillDetail, Long> {
    Optional<BillDetail> findByBillAndProductDetail(Bill bill, ProductDetail productDetail);
    Optional<BillDetail> findByProductDetailAndBill(ProductDetail productDetail, Bill bill);
    List<BillDetail> findByBill(Bill bill);
}
