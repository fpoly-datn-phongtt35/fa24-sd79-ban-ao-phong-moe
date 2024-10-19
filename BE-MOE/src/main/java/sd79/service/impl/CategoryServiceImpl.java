package sd79.service.impl;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.productRequests.CategoryRequest;
import sd79.dto.response.productResponse.CategoryResponse;
import sd79.exception.EntityNotFoundException;
import sd79.exception.NotAllowedDeleteEntityException;
import sd79.model.Category;
import sd79.model.User;
import sd79.repositories.products.CategoryRepository;
import sd79.repositories.products.ProductRepository;
import sd79.repositories.auth.UserRepository;
import sd79.service.CategoryService;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    @Override
    public List<CategoryResponse> getAllCategories(String keyword) {
        return this.categoryRepository.findCategoriesByNameAndIsDeletedIsFalse(keyword).stream().map(this::convertToCategoryResponse).toList();
    }

    @Transactional
    @Override
    public Integer storeCategory(CategoryRequest req) {
        if(this.categoryRepository.existsCategoryByName(req.getName().trim())) {
            throw new EntityExistsException("Danh mục " + req.getName() + " đã tồn tại");
        }
        User user = userRepository.findById(req.getUserId()).orElse(null);
        Category category = new Category();
        category.setName(req.getName());
        category.setCreatedBy(user);
        category.setUpdatedBy(user);
        return this.categoryRepository.save(category).getId();
    }

    @Transactional
    @Override
    public void updateCategory(CategoryRequest req, Integer id) {

        Category category = this.getCategoryById(id);
        if(!Objects.equals(category.getName(), req.getName().trim())) {
            if(this.categoryRepository.existsCategoryByName(req.getName().trim())) {
                throw new EntityExistsException("Danh mục " + req.getName() + " đã tồn tại");
            }
        }
        category.setName(req.getName());
        category.setUpdatedBy(this.getUserById(req.getUserId()));
        this.categoryRepository.save(category);
    }

    @Override
    public void isDeleteCategory(Integer id) {
        Category category = this.getCategoryById(id);
        try {
            this.categoryRepository.delete(category);
        } catch (Exception e) {
            throw new NotAllowedDeleteEntityException("Không thể xóa danh mục này!");
        }
    }

    private Category getCategoryById(Integer id) {
        return this.categoryRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Category not found"));
    }

    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private CategoryResponse convertToCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .productCount(this.productRepository.countByCategory(category.getId()))
                .createdBy(category.getCreatedBy().getUsername())
                .createdAt(category.getCreateAt())
                .updatedAt(category.getUpdateAt())
                .build();
    }
}
