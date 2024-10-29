/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service;

import sd79.dto.requests.productRequests.CategoryRequest;
import sd79.dto.response.productResponse.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories(String keyword);

    Integer storeCategory(CategoryRequest req);

    void updateCategory(CategoryRequest req, Integer id);

    void isDeleteCategory(Integer id);
}
