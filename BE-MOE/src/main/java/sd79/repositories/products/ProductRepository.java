/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.repositories.products;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.model.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT count(p) from Product p where p.category.id = :idCategory and p.isDeleted = false ")
    Long countByCategory(@Param("idCategory") Integer idCategory);

    @Query("SELECT count(p) from Product p where p.brand.id = :idBrand and p.isDeleted = false ")
    Long countByBrand(@Param("idBrand") Integer idBrand);

    @Query("SELECT count(p) from Product p where p.material.id = :idMaterial and p.isDeleted = false ")
    Long countByMaterial(@Param("idMaterial") Integer idMaterial);

    @Query("FROM Product WHERE id != :id AND (category.name = :category OR brand.name = :brand OR  1 = 1) order by updateAt desc")
    List<Product> getRelatedItem(Long id, String category, String brand, Pageable pageable);
}
