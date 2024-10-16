package sd79.service;

import sd79.dto.requests.productRequests.MaterialRequest;
import sd79.dto.response.productResponse.MaterialResponse;

import java.util.List;

public interface MaterialService {
    List<MaterialResponse> getAllMaterials();

    Integer storeMaterial(MaterialRequest req);

    void updateMaterial(MaterialRequest req, Integer id);

    void isDeleteBrand(Integer id);
}
