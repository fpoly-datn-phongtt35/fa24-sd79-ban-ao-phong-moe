package sd79.service;

import sd79.dto.requests.ProductImageReq;
import sd79.dto.requests.ProductRequest;
import sd79.dto.requests.common.ParamReq;
import sd79.dto.response.PageableResponse;
import sd79.enums.ProductStatus;

public interface ProductService {

    PageableResponse getAllProducts(int pageNo, int pageSize, String keyword, ProductStatus status);

    long storeProduct(ProductRequest req);

    void storeProductImages(ProductImageReq req);

    void setProductToInactive(long id);
}
