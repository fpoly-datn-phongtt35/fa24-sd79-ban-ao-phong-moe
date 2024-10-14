package sd79.repositories.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sd79.model.ProductDetail;
@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {

    @Query("SELECT coalesce(sum(p.quantity), 0) FROM ProductDetail p WHERE p.product.id = :productId")
    int countByProductId(long productId);
}
