package sd79.service;

import sd79.dto.requests.CategoryRequest;
import sd79.dto.response.productResponse.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();

    Integer storeCategory(CategoryRequest req);

    void updateCategory(CategoryRequest req, Integer id);

    void isDeleteCategory(Integer id);
}
