package sd79.service;

import sd79.dto.requests.BrandRequest;
import sd79.dto.response.productResponse.BrandResponse;

import java.util.List;

public interface BrandService {
    List<BrandResponse> getAllBrands();

    Integer storeBrand(BrandRequest req);

    void updateBrand(BrandRequest req, Integer id);

    void isDeleteBrand(Integer id);
}
