/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service.clients.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import sd79.dto.response.clients.product.ProductClientResponse;
import sd79.dto.response.clients.product.ProductDetailClientResponse;
import sd79.exception.EntityNotFoundException;
import sd79.model.Product;
import sd79.model.ProductImage;
import sd79.repositories.customQuery.ProductCustomizeQuery;
import sd79.repositories.products.ProductDetailRepository;
import sd79.repositories.products.ProductRepository;
import sd79.service.clients.ClientProduct;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientProductImpl implements ClientProduct {
    private final ProductCustomizeQuery productCustomizeQuery;

    private final ProductRepository productRepository;

    private final ProductDetailRepository productDetailRepository;

    @Override
    public List<ProductClientResponse> getExploreOurProducts(Integer page) {
        if (page < 1) {
            page = 1;
        }
        return this.productCustomizeQuery.getExploreOurProducts(page);
    }

    @Override
    public List<ProductClientResponse> getBestSellingProducts() {
        return this.productCustomizeQuery.getBestSellingProducts();
    }

    @Override
    public ProductDetailClientResponse getProductDetail(Long id) {
        Product product = this.productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found"));
        List<ProductClientResponse> relatedItem = this.productRepository.getRelatedItem(product.getId(), product.getCategory().getName(), product.getBrand().getName(), PageRequest.of(0, 5)).stream().map(s -> ProductClientResponse.builder()
                .productId(s.getId())
                .imageUrl(s.getProductImages().getFirst().getImageUrl())
                .name(s.getName())
                .retailPrice(s.getProductDetails().getFirst().getRetailPrice())
                .discountPrice(s.getProductDetails().getFirst().getRetailPrice().multiply(BigDecimal.valueOf(1).subtract(BigDecimal.valueOf(0.50))))
                .rate(4)
                .rateCount(104)
                .build()
        ).toList();
        return ProductDetailClientResponse.builder()
                .productId(id)
                .imageUrl(product.getProductImages().stream()
                        .map(ProductImage::getImageUrl)
                        .collect(Collectors.toList()))
                .name(product.getName())
                .retailPrice(product.getProductDetails().getFirst().getRetailPrice())
                .discountPrice(product.getProductDetails().getFirst().getRetailPrice().multiply(BigDecimal.valueOf(1).subtract(BigDecimal.valueOf(0.50))))
                .rate(4)
                .rateCount(102)
                //TODO details
                .sizes(this.productDetailRepository.getSizeProduct(product.getId()))
                .colors(this.productDetailRepository.getColorProduct(product.getId()))
                .quantity(this.productDetailRepository.countByProductId(product.getId()))
                .origin(product.getOrigin())
                .category(product.getCategory().getName())
                .material(product.getMaterial().getName())
                .brand(product.getBrand().getName())
                .description(product.getDescription())
                //TODO related items
                .relatedItem(relatedItem)
                .build();
    }
}
