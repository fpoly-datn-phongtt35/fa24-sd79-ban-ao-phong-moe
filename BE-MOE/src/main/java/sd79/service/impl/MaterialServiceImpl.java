package sd79.service.impl;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.productRequests.MaterialRequest;
import sd79.dto.response.productResponse.MaterialResponse;
import sd79.exception.EntityNotFoundException;
import sd79.exception.NotAllowedDeleteEntityException;
import sd79.model.Material;
import sd79.model.User;
import sd79.repositories.products.MaterialRepository;
import sd79.repositories.products.ProductRepository;
import sd79.repositories.auth.UserRepository;
import sd79.service.MaterialService;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    @Override
    public List<MaterialResponse> getAllMaterials(String keyword) {
        return this.materialRepository.findMaterialsByNameAndIsDeletedIsFalse(keyword).stream().map(this::convertToMaterialResponse).toList();
    }

    @Transactional
    @Override
    public Integer storeMaterial(MaterialRequest req) {
        if (this.materialRepository.existsMaterialByName(req.getName().trim())) {
            throw new EntityExistsException("Chất liệu " + req.getName() + " đã tồn tại");
        }
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
        if (!Objects.equals(material.getName(), req.getName().trim())) {
            if (this.materialRepository.existsMaterialByName(req.getName().trim())) {
                throw new EntityExistsException("Chất liệu " + req.getName() + " đã tồn tại");
            }
        }
        material.setName(req.getName());
        material.setUpdatedBy(this.getUserById(req.getUserId()));
        this.materialRepository.save(material);
    }

    @Override
    public void isDeleteBrand(Integer id) {
        Material material = this.getMaterialById(id);
        try {
            this.materialRepository.delete(material);
        } catch (Exception e) {
            throw new NotAllowedDeleteEntityException("Không thể xóa chất liệu này!");
        }
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
