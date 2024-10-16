package sd79.service;

import sd79.dto.requests.productRequests.*;
import sd79.dto.requests.common.ProductParamFilter;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.productResponse.ProductModifyRes;
import sd79.enums.ProductStatus;

import java.util.List;

public interface ProductService {

    PageableResponse getAllProducts(ProductParamFilter param);

    long storeProduct(ProductRequest req);

    void storeProductImages(ProductImageReq req);

    void setProductStatus(long id, ProductStatus status);

    void moveToBin(Long id);

    ProductModifyRes getProductInfo(long id);

    void updateProduct(ProductUpdateRequest req, long id);

    void setProductDetailStatus(long id, boolean status);

    void updateAttributeProductDetail(List<ProductDetailModify> items);

    long storeProductDetailAttribute(ProductDetailStoreRequest request);
}
