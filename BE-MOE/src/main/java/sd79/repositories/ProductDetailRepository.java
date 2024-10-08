package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sd79.model.ProductDetail;
@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {

    @Query("SELECT sum(p.quantity) FROM ProductDetail p WHERE p.product.id = :productId")
    int countByProductId(long productId);
}
