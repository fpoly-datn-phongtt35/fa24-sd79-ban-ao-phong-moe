package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT count(p) from Product p where p.category.id = :idCategory and p.isDeleted = false ")
    Long countByCategory(@Param("idCategory") Integer idCategory);
}
