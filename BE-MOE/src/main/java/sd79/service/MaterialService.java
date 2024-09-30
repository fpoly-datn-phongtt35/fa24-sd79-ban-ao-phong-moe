package sd79.service;

import sd79.dto.requests.MaterialRequest;
import sd79.dto.response.MaterialResponse;

import java.util.List;

public interface MaterialService {
    List<MaterialResponse> getAllMaterials();

    Integer storeMaterial(MaterialRequest req);

    void updateMaterial(MaterialRequest req, Integer id);

    void isDeleteBrand(Integer id);
}
