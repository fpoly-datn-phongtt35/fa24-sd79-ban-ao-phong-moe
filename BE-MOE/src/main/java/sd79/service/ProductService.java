package sd79.service;

import sd79.dto.requests.ProductRequest;
import sd79.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts();

    long storeProduct(ProductRequest req);
}
