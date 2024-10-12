package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sd79.dto.requests.ProductDetailRequest;
import sd79.dto.requests.ProductImageReq;
import sd79.dto.requests.ProductRequest;
import sd79.dto.requests.common.ParamReq;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.ProductResponse;
import sd79.enums.ProductStatus;
import sd79.exception.EntityNotFoundException;
import sd79.model.*;
import sd79.repositories.*;
import sd79.repositories.customQuery.ProductCustomizeQuery;
import sd79.service.ProductService;
import sd79.utils.CloudinaryUpload;

import java.util.List;
import java.util.stream.Collectors;

import static sd79.utils.UserUtils.getUserById;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    private final BrandRepository brandRepository;

    private final MaterialRepository materialRepository;

    private final ProductImageRepository productImageRepository;

    private final SizeRepository sizeRepository;

    private final ColorRepository colorRepository;

    private final ProductDetailRepository productDetailRepository;

    private final CloudinaryUpload cloudinaryUpload;

    private final ProductCustomizeQuery productCustomizeQuery;
    
    @Override
    public PageableResponse getAllProducts(Integer pageNo, Integer pageSize, String keyword, ProductStatus status) {
        if (pageNo < 1) {
            pageNo = 1;
        }
        return this.productCustomizeQuery.getAllProducts(pageNo, pageSize, keyword, status);
    }

    @Override
    public long storeProduct(ProductRequest req) {
        User user = getUserById(req.getUserId());

        // Products
        Product product = new Product();
        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setStatus(req.getStatus());

        product.setCategory(this.categoryRepository.findById(req.getCategoryId()).orElseThrow(() -> new EntityNotFoundException("Invalid category")));
        product.setBrand(this.brandRepository.findById(req.getBrandId()).orElseThrow(() -> new EntityNotFoundException("Invalid brand")));
        product.setMaterial(this.materialRepository.findById(req.getMaterialId()).orElseThrow(() -> new EntityNotFoundException("Invalid material")));

        product.setOrigin(req.getOrigin());
        product.setCreatedBy(user);
        product.setUpdatedBy(user);

        product = this.productRepository.save(product);

        // Product details
        for (ProductDetailRequest prd : req.getProductDetails()) {
            ProductDetail productDetail = new ProductDetail();
            productDetail.setProduct(product);
            productDetail.setRetailPrice(prd.getRetailPrice());
            productDetail.setQuantity(prd.getQuantity());
            productDetail.setStatus(req.getStatus());
            productDetail.setSize(this.getSizeById(prd.getSizeId()));
            productDetail.setColor(this.getColorById(prd.getColorId()));

            this.productDetailRepository.save(productDetail);
        }

        return product.getId();
    }

    @Override
    public void storeProductImages(ProductImageReq req) {
        Product product = this.getProductById(req.getProductId());
        for (MultipartFile file : req.getImages()) {
            ProductImage productImage = new ProductImage();
            productImage.setProduct(product);
            productImage.setImageUrl(this.cloudinaryUpload.upload(file));
            this.productImageRepository.save(productImage);
        }
    }

    @Override
    public void setProductStatus(long id, ProductStatus status) {
        Product product = this.getProductById(id);
        product.setStatus(status);
        this.productRepository.save(product);
    }

    @Override
    public void moveToBin(Long id) {
        Product product = this.getProductById(id);
        product.setIsDeleted(true);
        this.productRepository.save(product);
    }

    @Override
    public ProductResponse getProductInfo(long id) {
        return convertToProductResponse(this.getProductById(id));
    }

    private Product getProductById(long id) {
        return this.productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    private Size getSizeById(int id) {
        return this.sizeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Size not found"));
    }

    private Color getColorById(int id) {
        return this.colorRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Color not found"));
    }

    private ProductResponse convertToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .imageUrl(convertToUrl(product.getProductImages()))
                .name(product.getName())
                .description(product.getDescription())
                .status(product.getStatus())
                .category(product.getCategory().getName())
                .brand(product.getBrand().getName())
                .material(product.getMaterial().getName())
                .origin(product.getOrigin())
                .createdBy(product.getCreatedBy().getUsername())
                .updatedBy(product.getUpdatedBy().getUsername())
                .createdAt(product.getCreateAt())
                .updatedAt(product.getUpdateAt())
                .productQuantity(this.productDetailRepository.countByProductId(product.getId()))
                .build();
    }

    private List<String> convertToUrl(List<ProductImage> images) {
        return images.stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
    }

}
