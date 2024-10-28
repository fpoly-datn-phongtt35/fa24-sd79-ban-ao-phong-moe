/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service;

import sd79.dto.requests.productRequests.MaterialRequest;
import sd79.dto.response.productResponse.MaterialResponse;

import java.util.List;

public interface MaterialService {
    List<MaterialResponse> getAllMaterials(String keyword);

    Integer storeMaterial(MaterialRequest req);

    void updateMaterial(MaterialRequest req, Integer id);

    void isDeleteBrand(Integer id);
}
