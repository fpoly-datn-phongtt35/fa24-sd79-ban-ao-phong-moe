/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service.clients;

import jakarta.servlet.http.HttpServletRequest;
import sd79.dto.requests.clients.CartReq;
import sd79.dto.requests.clients.FilterForCartReq;
import sd79.dto.response.clients.customer.UserInfoRes;
import sd79.dto.response.clients.product.ProductClientResponse;
import sd79.dto.response.clients.product.ProductDetailClientResponse;
import sd79.model.redis_model.Cart;

import java.util.List;
import java.util.Set;

public interface ClientProduct {
    List<ProductClientResponse> getExploreOurProducts(Integer page);

    List<ProductClientResponse> getBestSellingProducts();

    ProductDetailClientResponse getProductDetail(Long id);

    Set<Cart> getCarts(HttpServletRequest request);

    void addToCart(FilterForCartReq req);

    void updateCart(CartReq req);

    void deleteCart(String id, String username);

    UserInfoRes getUserInfo(long id);
}
