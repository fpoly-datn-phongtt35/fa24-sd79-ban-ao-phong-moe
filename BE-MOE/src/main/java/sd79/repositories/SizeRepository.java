package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.Size;

import java.util.List;

@Repository
public interface SizeRepository extends JpaRepository<Size, Integer> {
    List<Size> findByIsDeletedFalse();
}
