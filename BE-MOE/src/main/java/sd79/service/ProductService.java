package sd79.service;

import sd79.dto.requests.ProductImageReq;
import sd79.dto.requests.ProductRequest;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.productResponse.ProductModifyRes;
import sd79.dto.response.productResponse.ProductResponse;
import sd79.enums.ProductStatus;

public interface ProductService {

    PageableResponse getAllProducts(Integer pageNo, Integer pageSize, String keyword, ProductStatus status, String category, String brand, String material, String origin);

    long storeProduct(ProductRequest req);

    void storeProductImages(ProductImageReq req);

    void setProductStatus(long id, ProductStatus status);

    void moveToBin(Long id);

    ProductModifyRes getProductInfo(long id);

    void updateProduct(ProductRequest req, long id);
}
