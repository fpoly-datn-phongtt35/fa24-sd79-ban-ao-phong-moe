/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service.clients;

import sd79.dto.response.clients.product.ProductClientResponse;
import sd79.dto.response.clients.product.ProductDetailClientResponse;

import java.util.List;

public interface ClientProduct {
    List<ProductClientResponse> getExploreOurProducts(Integer page);

    List<ProductClientResponse> getBestSellingProducts();

    ProductDetailClientResponse getProductDetail(Long id);
}
