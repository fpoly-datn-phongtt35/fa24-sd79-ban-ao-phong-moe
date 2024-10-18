package sd79.service.impl;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.dto.requests.productRequests.SizeRequest;
import sd79.dto.response.productResponse.SizeResponse;
import sd79.exception.EntityNotFoundException;
import sd79.exception.NotAllowedDeleteEntityException;
import sd79.model.Size;
import sd79.model.User;
import sd79.repositories.products.SizeRepository;
import sd79.repositories.auth.UserRepository;
import sd79.service.SizeService;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SizeServiceImpl implements SizeService {

    private final SizeRepository sizeRepository;

    private final UserRepository userRepository;

    @Override
    public List<SizeResponse> getAllSizes(String keyword) {
        return this.sizeRepository.findSizesByNameAndIsDeletedIsFalse(keyword).stream().map(this::convertToSizeResponse).toList();
    }

    @Override
    public int storeSize(SizeRequest req) {
        if (this.sizeRepository.existsSizeByName(req.getName().trim())) {
            throw new EntityExistsException("Kích thước " + req.getName() + " đã tồn tại");
        }
        User user = getUserById(req.getUserId());
        Size size = new Size();
        size.setName(req.getName());
        size.setLength(req.getLength());
        size.setWidth(req.getWidth());
        size.setSleeve(req.getSleeve());
        size.setCreatedBy(user);
        size.setUpdatedBy(user);
        return this.sizeRepository.save(size).getId();
    }

    @Override
    public void updateSize(SizeRequest req, int id) {
        User user = getUserById(req.getUserId());
        Size size = getSizeById(id);
        if (!Objects.equals(size.getName(), req.getName())) {
            if (this.sizeRepository.existsSizeByName(req.getName().trim())) {
                throw new EntityExistsException("Kích thước " + req.getName() + " đã tồn tại");
            }
        }
        size.setName(req.getName());
        size.setLength(req.getLength());
        size.setWidth(req.getWidth());
        size.setSleeve(req.getSleeve());
        size.setUpdatedBy(user);
        this.sizeRepository.save(size);
    }

    @Override
    public void isDeleteSize(int id) {
        Size size = getSizeById(id);
        try {
            this.sizeRepository.delete(size);
        } catch (Exception e) {
            throw new NotAllowedDeleteEntityException("Không thể xóa thuộc tính này!");
        }
    }

    private Size getSizeById(int id) {
        return this.sizeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Size not found"));
    }

    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private SizeResponse convertToSizeResponse(Size size) {
        return SizeResponse.builder()
                .id(size.getId())
                .name(size.getName())
                .length(size.getLength())
                .width(size.getWidth())
                .sleeve(size.getSleeve())
                .createdBy(size.getCreatedBy().getUsername())
                .createdAt(size.getCreateAt())
                .updatedAt(size.getUpdateAt())
                .build();
    }
}
