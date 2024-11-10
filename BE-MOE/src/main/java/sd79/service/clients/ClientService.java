/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service.clients;

import jakarta.servlet.http.HttpServletRequest;
import sd79.dto.requests.clients.bills.BillClientRequest;
import sd79.dto.requests.clients.cart.CartRequest;
import sd79.dto.requests.productRequests.ProductRequests;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.clients.cart.CartResponse;
import sd79.dto.response.clients.customer.UserInfoRes;
import sd79.dto.response.clients.invoices.InvoiceResponse;
import sd79.dto.response.clients.product.ProductResponse;

import java.util.List;
import java.util.Set;

public interface ClientService {
    List<ProductResponse.Product> getExploreOurProducts(Integer page);

    Set<ProductResponse.Product> getBestSellingProducts();

    ProductResponse.ProductDetail getProductDetail(Long id);

    List<CartResponse.Cart> getCarts(HttpServletRequest request);

    void addToCart(CartRequest.FilterParams req);

    CartResponse.Cart buyNow(CartRequest.FilterParams req);

    void updateCart(CartRequest.Param req);

    void deleteCart(String id, String username);

    UserInfoRes getUserInfo(long id);

    long saveBill(BillClientRequest.BillCreate req);

    PageableResponse getInvoices(InvoiceResponse.Param param);

    void cancelInvoice(long id, String message);

    List<InvoiceResponse.InvoiceStatus> getInvoiceStatuses();

     PageableResponse productFilters(ProductRequests.ParamFilters param);
}
