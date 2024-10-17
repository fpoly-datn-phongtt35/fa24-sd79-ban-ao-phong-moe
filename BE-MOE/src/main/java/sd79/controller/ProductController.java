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
            summary = "Get all product listings",
            description = "Get the entire product list (updating search and pagination functions)"
    )
    @GetMapping("/archive")
    public ResponseData<?> getAllProductArchives(ProductParamFilter param) {
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved product list", this.productService.productArchive(param));
    }

    @Operation(
            summary = "Create Product",
            description = "Add a product into database"
    )
    @PostMapping
    public ResponseData<?> storeProduct(@RequestBody ProductRequest request) {
        return new ResponseData<>(HttpStatus.CREATED.value(), "Thêm thành công", this.productService.storeProduct(request));
    }

    @Operation(
            summary = "Upload image",
            description = "Upload the image to cloudinary and return the url to save to the database"
    )
    @PostMapping("/upload")
    public ResponseData<?> uploadFile(@ModelAttribute ProductImageReq request) {
        this.productService.storeProductImages(request);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Successfully added product images");
    }

    @Operation(
            summary = "Update status product",
            description = "Only update the product's status"
    )
    @PatchMapping("/change-status/{id}/{status}")
    public ResponseData<?> changeProductStatus(@PathVariable("id") long id, @PathVariable("status") ProductStatus status) {
        this.productService.setProductStatus(id, status);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Sản phẩm đã được lưu vào kho lưu trữ");
    }

    @Operation(
            summary = "Move product to bin",
            description = "Switch the product to isDelete = true and the product will be hidden from the display list"
    )
    @PatchMapping("/move-to-bin/{id}")
    public ResponseData<?> moveToBin(@PathVariable Long id) {
        this.productService.moveToBin(id);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Sản phẩm đã lưu ở kho lưu trữ");
    }

    @Operation(
            summary = "Restore product",
            description = "Switch the product to isDelete = false and display to form"
    )
    @PatchMapping("/restore/{id}")
    public ResponseData<?> restore(@PathVariable Long id) {
        this.productService.restore(id);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Sản phẩm đã được khôi phục");
    }

    @Operation(
            summary = "Restore product",
            description = "Switch the product to isDelete = false and display to form"
    )
    @DeleteMapping("/delete-forever/{id}")
    public ResponseData<?> deleteForever(@PathVariable Long id) {
        this.productService.deleteProductForever(id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Xóa thành công");
    }

    @Operation(
            summary = "Get product by id",
            description = "Get a product from the database"
    )
    @GetMapping("/{id}")
    public ResponseData<?> getProduct(@PathVariable Long id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Found a product with id " + id, this.productService.getProductInfo(id));
    }

    @Operation(
            summary = "Update product",
            description = "Product updates"
    )
    @PutMapping("/update-product/{id}")
    public ResponseData<?> updateProduct(@PathVariable Long id, @RequestBody ProductUpdateRequest request) {
        this.productService.updateProduct(request, id);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Cập nhật thành công");
    }

    @Operation(
            summary = "Update status product detail",
            description = "Update status for detailed products"
    )
    @PatchMapping("/change-status/product-detail/{id}/{status}")
    public ResponseData<?> changeProductStatus(@PathVariable Long id, @PathVariable("status") Boolean status) {
        this.productService.setProductDetailStatus(id, status);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Cập nhật thành công");
    }

    @Operation(
            summary = "Update product details",
            description = "Update multiple product details based on product id"
    )
    @PutMapping("/update-product-details/attribute")
    public ResponseData<?> updateProductDetailAttribute(@RequestBody List<ProductDetailModify> items) {
        this.productService.updateAttributeProductDetail(items);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Cập nhật thành công");
    }

    @Operation(
            summary = "New attribute product detail",
            description = "Create a new attribute for the product and that attribute does not exist in the product"
    )
    @PostMapping("/store-product-detail/attribute")
    public ResponseData<?> storeProductDetailAttribute(@RequestBody ProductDetailStoreRequest item) {
        return new ResponseData<>(HttpStatus.CREATED.value(), "Thêm thành công", this.productService.storeProductDetailAttribute(item));
    }

    @Operation(
            summary = "Remove image",
            description = "Remove image from database and cloudinary"
    )
    @DeleteMapping("/remove-image")
    public ResponseData<?> removeImage(@RequestParam String publicId) {
        this.productService.removeImageCloudinary(publicId);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Xóa thành công");
    }
}
    