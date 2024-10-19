package sd79.repositories.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sd79.model.ProductDetail;
@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {

    @Query("SELECT coalesce(sum(p.quantity), 0) FROM ProductDetail p WHERE p.product.id = :productId AND p.status = 'ACTIVE'")
    int countByProductId(long productId);

    @Query("SELECT COUNT(*) > 0 FROM ProductDetail d WHERE d.product.id = :id AND d.color.id = :colorId and d.size.id = :sizeId")
    boolean existsDetailByAttribute(long id, int colorId, int sizeId);
}
