package sd79.repositories.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sd79.model.Material;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {
    @Query("FROM Material WHERE isDeleted = false AND name like %:keyword%")
    List<Material> findMaterialsByNameAndIsDeletedIsFalse(String keyword);

    boolean existsMaterialByName(String name);
}
