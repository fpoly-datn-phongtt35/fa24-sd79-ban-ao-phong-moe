/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service.clients;

import jakarta.servlet.http.HttpServletRequest;
import sd79.dto.requests.clients.bills.BillClientRequest;
import sd79.dto.requests.clients.cart.CartReq;
import sd79.dto.requests.clients.other.FilterForCartReq;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.clients.cart.CartResponse;
import sd79.dto.response.clients.customer.UserInfoRes;
import sd79.dto.response.clients.invoices.InvoiceResponse;
import sd79.dto.response.clients.product.ProductClientResponse;
import sd79.dto.response.clients.product.ProductDetailClientResponse;

import java.util.List;
import java.util.Set;

public interface ClientService {
    List<ProductClientResponse> getExploreOurProducts(Integer page);

    Set<ProductClientResponse> getBestSellingProducts();

    ProductDetailClientResponse getProductDetail(Long id);

    List<CartResponse> getCarts(HttpServletRequest request);

    void addToCart(FilterForCartReq req);

    CartResponse buyNow(FilterForCartReq req);

    void updateCart(CartReq req);

    void deleteCart(String id, String username);

    UserInfoRes getUserInfo(long id);

    long saveBill(BillClientRequest.BillCreate req);

    PageableResponse getInvoices(InvoiceResponse.Param param);

    void cancelInvoice(long id, String message);

    List<InvoiceResponse.InvoiceStatus> getInvoiceStatuses();
}
