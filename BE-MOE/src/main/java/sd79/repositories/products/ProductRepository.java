package sd79.repositories.products;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.enums.ProductStatus;
import sd79.model.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByIsDeletedFalse();

    List<Product> findByIsDeletedTrue();

    @Query("FROM Product WHERE isDeleted = false AND name like %:keyword% AND status = :status")
    Page<Product> findAllProductActive(Pageable pageable, String keyword, ProductStatus status);

    @Query("SELECT count(p) from Product p where p.category.id = :idCategory and p.isDeleted = false ")
    Long countByCategory(@Param("idCategory") Integer idCategory);

    @Query("SELECT count(p) from Product p where p.brand.id = :idBrand and p.isDeleted = false ")
    Long countByBrand(@Param("idBrand") Integer idBrand);

    @Query("SELECT count(p) from Product p where p.material.id = :idMaterial and p.isDeleted = false ")
    Long countByMaterial(@Param("idMaterial") Integer idMaterial);
}
