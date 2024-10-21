package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.productRequests.BrandRequest;
import sd79.dto.response.productResponse.BrandResponse;
import sd79.exception.EntityNotFoundException;
import sd79.model.Brand;
import sd79.model.User;
import sd79.repositories.products.BrandRepository;
import sd79.repositories.products.ProductRepository;
import sd79.repositories.auth.UserRepository;
import sd79.service.BrandService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    @Override
    public List<BrandResponse> getAllBrands() {
        return this.brandRepository.findByIsDeletedFalse().stream().map(this::convertToBrandResponse).toList();
    }

    @Transactional
    @Override
    public Integer storeBrand(BrandRequest req) {
        User user = userRepository.findById(req.getUserId()).orElse(null);
        Brand brand = new Brand();
        brand.setName(req.getName());
        brand.setCreatedBy(user);
        brand.setUpdatedBy(user);
        return this.brandRepository.save(brand).getId();
    }

    @Transactional
    @Override
    public void updateBrand(BrandRequest req, Integer id) {
        Brand brand = this.getBrandById(id);
        brand.setName(req.getName());
        brand.setUpdatedBy(this.getUserById(req.getUserId()));
        this.brandRepository.save(brand);
    }

    @Override
    public void isDeleteBrand(Integer id) {
        Brand brand = this.getBrandById(id);
        brand.setIsDeleted(true);
        this.brandRepository.save(brand);
    }

    private Brand getBrandById(Integer id) {
        return this.brandRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Brand not found"));
    }

    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private BrandResponse convertToBrandResponse(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .productCount(this.productRepository.countByCategory(brand.getId()))
                .createdBy("Admin")
                .createdAt(brand.getCreateAt())
                .updatedAt(brand.getUpdateAt())
                .build();
    }

}
