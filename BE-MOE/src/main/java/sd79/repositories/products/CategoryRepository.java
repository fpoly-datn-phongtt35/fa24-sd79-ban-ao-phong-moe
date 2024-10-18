package sd79.repositories.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sd79.model.Category;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    @Query("FROM Category WHERE isDeleted = false AND name like %:keyword%")
    List<Category> findCategoriesByNameAndIsDeletedIsFalse(String keyword);

    boolean existsCategoryByName(String name);
}
