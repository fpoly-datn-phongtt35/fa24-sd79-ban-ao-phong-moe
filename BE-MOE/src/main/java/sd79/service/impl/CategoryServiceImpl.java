package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.productRequests.CategoryRequest;
import sd79.dto.response.productResponse.CategoryResponse;
import sd79.exception.EntityNotFoundException;
import sd79.model.Category;
import sd79.model.User;
import sd79.repositories.products.CategoryRepository;
import sd79.repositories.products.ProductRepository;
import sd79.repositories.auth.UserRepository;
import sd79.service.CategoryService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return this.categoryRepository.findByIsDeletedFalse().stream().map(this::convertToCategoryResponse).toList();
    }

    @Transactional
    @Override
    public Integer storeCategory(CategoryRequest req) {
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
        category.setName(req.getName());
        category.setUpdatedBy(this.getUserById(req.getUserId()));
        this.categoryRepository.save(category);
    }

    @Override
    public void isDeleteCategory(Integer id) {
        Category category = this.getCategoryById(id);
        category.setIsDeleted(true);
        this.categoryRepository.save(category);
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
