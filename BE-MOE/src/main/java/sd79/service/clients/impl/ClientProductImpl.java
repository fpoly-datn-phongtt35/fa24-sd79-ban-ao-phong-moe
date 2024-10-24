package sd79.service.clients.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.dto.response.clients.product.BestSellingProductResponse;
import sd79.repositories.customQuery.ProductCustomizeQuery;
import sd79.service.clients.ClientProduct;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientProductImpl implements ClientProduct {
    private final ProductCustomizeQuery productCustomizeQuery;

    @Override
    public List<BestSellingProductResponse> getExploreOurProducts(Integer page) {
        if (page < 1) {
            page = 1;
        }
        return this.productCustomizeQuery.getExploreOurProducts(page);
    }

    @Override
    public List<BestSellingProductResponse> getBestSellingProducts() {
        return this.productCustomizeQuery.getBestSellingProducts();
    }
}
