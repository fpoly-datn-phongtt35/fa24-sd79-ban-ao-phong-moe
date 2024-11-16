/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service;

import sd79.dto.requests.common.ProductParamFilter2;
import sd79.dto.requests.productRequests.*;
import sd79.dto.requests.common.ProductParamFilter;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.productResponse.ProductModifyRes;
import sd79.enums.ProductStatus;

import java.util.List;

public interface ProductService {

    PageableResponse getAllProducts(ProductParamFilter param);

    PageableResponse getAllProductDetails(ProductParamFilter2 param);

    long storeProduct(ProductRequest req);

    void storeProductImages(ProductImageReq req);

    void setProductStatus(long id, ProductStatus status);

    void moveToBin(Long id);

    void restore(Long id);

    void deleteProductForever(Long id);

    ProductModifyRes getProductInfo(long id);

    void updateProduct(ProductUpdateRequest req, long id);

    void setProductDetailStatus(long id, boolean status);

    void updateAttributeProductDetail(List<ProductDetailModify> items);

    long storeProductDetailAttribute(ProductDetailStoreRequest request);

    void removeImageCloudinary(String publicId);

    PageableResponse productArchive(ProductParamFilter param);
}
