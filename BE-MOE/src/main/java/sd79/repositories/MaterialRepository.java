package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.Material;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {
    List<Material> findByIsDeletedFalse();
}
