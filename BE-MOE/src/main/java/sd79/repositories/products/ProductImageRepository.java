package sd79.repositories.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import sd79.model.ProductImage;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM ProductImage WHERE publicId = :publicId")
    void deleteByPublicId(String publicId);
}
