package sd79.controller.client;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.common.ProductParamFilter;
import sd79.dto.response.ResponseData;
import sd79.service.CategoryService;
import sd79.service.ProductService;
import sd79.service.clients.ClientProduct;

@Slf4j
@RestController
@RequestMapping("api/${api.version}/client")
@Tag(name = "Client Controller", description = "Client controller")
@RequiredArgsConstructor
@Validated
public class ProductClientController {

    private final ProductService productService;

    private final ClientProduct clientProduct;

    private final CategoryService categoryService;

    @Operation(
            summary = "Get all product listings",
            description = "Get the entire product list (updating search and pagination functions)"
    )
    @GetMapping
    public ResponseData<?> getAllProducts(@RequestParam(required = false, defaultValue = "0") Integer page) {
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved product list", this.clientProduct.getExploreOurProducts(page));
    }


    @Operation(
            summary = "Top 5 Best Selling Products",
            description = "Get Top 5 Best Selling Products"
    )
    @GetMapping("/best-selling-products")
    public ResponseData<?> getBestSellingProduct() {
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully 5 best selling product", this.clientProduct.getBestSellingProducts());
    }


    @Operation(
            summary = "Get Category",
            description = "Get all Category from database"
    )
    @GetMapping("/category")
    public ResponseData<?> getAllCategories() {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", categoryService.getAllCategories(""));
    }

    @Operation(
            summary = "Get Product",
            description = "Get product detail"
    )
    @GetMapping("/{id}")
    public ResponseData<?> getProduct(@PathVariable Long id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", this.clientProduct.getProductDetail(id));
    }
}
