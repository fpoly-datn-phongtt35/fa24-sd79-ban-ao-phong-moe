package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.productRequests.*;
import sd79.dto.requests.common.ProductParamFilter;
import sd79.dto.response.ResponseData;
import sd79.enums.ProductStatus;
import sd79.service.ProductService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("api/${api.version}/product")
@Tag(name = "Product Controller", description = "Product and product management details")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(
            summary = "Get all product listings",
            description = "Get the entire product list (updating search and pagination functions)"
    )
    @GetMapping
    public ResponseData<?> getAllProducts(ProductParamFilter param) {
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved product list", this.productService.getAllProducts(param));
    }

    @Operation(
            summary = "Create Product",
            description = "Add a product into database"
    )
    @PostMapping
    public ResponseData<?> storeProduct(@RequestBody ProductRequest request) {
        return new ResponseData<>(HttpStatus.CREATED.value(), "Successfully added product to the database", this.productService.storeProduct(request));
    }

    @PostMapping("/upload")
    public ResponseData<?> uploadFile(@ModelAttribute ProductImageReq request) {
        this.productService.storeProductImages(request);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Successfully added product images");
    }

    @PatchMapping("/change-status/{id}/{status}")
    public ResponseData<?> changeProductStatus(@PathVariable("id") long id, @PathVariable("status") ProductStatus status) {
        this.productService.setProductStatus(id, status);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Move to bin successfully");
    }

    @PatchMapping("/move-to-bin/{id}")
    public ResponseData<?> moveToBin(@PathVariable Long id) {
        this.productService.moveToBin(id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Move to bin successfully");
    }

    @GetMapping("/{id}")
    public ResponseData<?> getProduct(@PathVariable Long id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Found a product with id " + id, this.productService.getProductInfo(id));
    }

    @PutMapping("/update-product/{id}")
    public ResponseData<?> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        log.info("name={}", request.getName());
        this.productService.updateProduct(request, id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Cập nhật thành công");
    }

    @PatchMapping("/change-status/product-detail/{id}/{status}")
    public ResponseData<?> changeProductStatus(@PathVariable Long id, @PathVariable("status") Boolean status) {
        this.productService.setProductDetailStatus(id, status);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Cập nhật thành công");
    }

    @PutMapping("/update-product-details/attribute")
    public ResponseData<?> updateProductDetailAttribute(@RequestBody List<ProductDetailModify> items) {
        this.productService.updateAttributeProductDetail(items);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Cập nhật thành công");
    }

    @PostMapping("/store-product-detail/attribute")
    public ResponseData<?> storeProductDetailAttribute(@RequestBody ProductDetailStoreRequest item) {
        return new ResponseData<>(HttpStatus.CREATED.value(), "Thêm thành công", this.productService.storeProductDetailAttribute(item));
    }
}
    