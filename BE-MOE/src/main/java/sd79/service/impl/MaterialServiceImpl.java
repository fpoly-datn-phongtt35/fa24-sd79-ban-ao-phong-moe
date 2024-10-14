package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.MaterialRequest;
import sd79.dto.response.productResponse.MaterialResponse;
import sd79.exception.EntityNotFoundException;
import sd79.model.Material;
import sd79.model.User;
import sd79.repositories.products.MaterialRepository;
import sd79.repositories.products.ProductRepository;
import sd79.repositories.auth.UserRepository;
import sd79.service.MaterialService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    @Override
    public List<MaterialResponse> getAllMaterials() {
        return this.materialRepository.findByIsDeletedFalse().stream().map(this::convertToMaterialResponse).toList();
    }

    @Transactional
    @Override
    public Integer storeMaterial(MaterialRequest req) {
        User user = getUserById(req.getUserId());
        Material material = new Material();
        material.setName(req.getName());
        material.setCreatedBy(user);
        material.setUpdatedBy(user);
        return this.materialRepository.save(material).getId();
    }

    @Transactional
    @Override
    public void updateMaterial(MaterialRequest req, Integer id) {
        Material material = this.getMaterialById(id);
        material.setName(req.getName());
        material.setUpdatedBy(this.getUserById(req.getUserId()));
        this.materialRepository.save(material);
    }

    @Transactional
    @Override
    public void isDeleteBrand(Integer id) {
        Material material = this.getMaterialById(id);
        material.setIsDeleted(true);
        this.materialRepository.save(material);
    }

    private Material getMaterialById(Integer id) {
        return this.materialRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Material not found"));
    }

    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private MaterialResponse convertToMaterialResponse(Material material) {
        return MaterialResponse.builder()
                .id(material.getId())
                .name(material.getName())
                .productCount(this.productRepository.countByMaterial(material.getId()))
                .createdBy(material.getCreatedBy().getUsername())
                .createdAt(material.getCreateAt())
                .updatedAt(material.getUpdateAt())
                .build();
    }

}
