package sd79.service.clients;

import sd79.dto.response.clients.product.BestSellingProductResponse;

import java.util.List;

public interface ClientProduct {
    List<BestSellingProductResponse> getExploreOurProducts(Integer page);

    List<BestSellingProductResponse> getBestSellingProducts();
}
