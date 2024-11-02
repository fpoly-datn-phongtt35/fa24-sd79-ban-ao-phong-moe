/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.repositories.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sd79.dto.response.productResponse.ColorResponse;
import sd79.dto.response.productResponse.SizeResponse;
import sd79.model.ProductDetail;

import java.util.HashSet;
import java.util.Optional;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {

    @Query("SELECT coalesce(sum(p.quantity), 0) FROM ProductDetail p WHERE p.product.id = :productId AND p.status = 'ACTIVE'")
    int countByProductId(long productId);

    @Query("SELECT COUNT(*) > 0 FROM ProductDetail d WHERE d.product.id = :id AND d.color.id = :colorId and d.size.id = :sizeId")
    boolean existsDetailByAttribute(long id, int colorId, int sizeId);

    @Query("SELECT DISTINCT new sd79.dto.response.productResponse.SizeResponse(p.size.id, p.size.name, p.size.length, p.size.width, p.size.sleeve, p.size.createdBy.username, p.size.createAt, p.size.updateAt) FROM  ProductDetail p WHERE p.product.id = :productId AND p.status = 'ACTIVE'")
    HashSet<SizeResponse> getSizeProduct(long productId);

    @Query("SELECT DISTINCT  new sd79.dto.response.productResponse.ColorResponse(p.color.id, p.color.name, p.color.hexColorCode , p.color.createdBy.username, p.color.createAt, p.color.updateAt) FROM  ProductDetail p WHERE p.product.id = :productId AND p.status = 'ACTIVE'")
    HashSet<ColorResponse> getColorProduct(long productId);

    @Query("FROM ProductDetail pd where pd.product.id = :productId AND pd.color.id = :colorId AND pd.size.id = :sizeId")
    Optional<ProductDetail> findByProductIdAndColorIdAndSizeId(long productId, int colorId, int sizeId);
}
