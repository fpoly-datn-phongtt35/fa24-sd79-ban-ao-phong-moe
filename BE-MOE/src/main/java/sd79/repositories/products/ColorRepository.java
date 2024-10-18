package sd79.repositories.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sd79.model.Color;

import java.util.List;

@Repository
public interface ColorRepository extends JpaRepository<Color, Integer> {

    @Query("FROM Color WHERE isDeleted = false AND name like %:keyword%")
    List<Color> findColorsByNameAndIsDeletedIsFalse(String keyword);

    boolean existsColorByName(String name);
}
