/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.clients.bills.BillClientRequest;
import sd79.dto.requests.clients.cart.CartReq;
import sd79.dto.requests.clients.other.FilterForCartReq;
import sd79.dto.response.ResponseData;
import sd79.service.CategoryService;
import sd79.service.clients.ClientProduct;


@Slf4j
@RestController
@RequestMapping("api/${api.version}/client")
@Tag(name = "Client Controller", description = "Client controller")
@RequiredArgsConstructor
@Validated
public class ClientController {

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
            description = "Get product detail by product ID"
    )
    @GetMapping("/{id}")
    public ResponseData<?> getProduct(@PathVariable Long id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", this.clientProduct.getProductDetail(id));
    }

    @Operation(
            summary = "Get Cart",
            description = "Retrieve the current user's shopping cart details"
    )
    @GetMapping("/cart")
    public ResponseData<?> getCarts(HttpServletRequest request) {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", this.clientProduct.getCarts(request));
    }

    @Operation(
            summary = "Add to Cart",
            description = "Add an item to the shopping cart with specified filters"
    )
    @PostMapping("/add-to-cart")
    public ResponseData<?> addToCart(@RequestBody FilterForCartReq cartReq) {
        this.clientProduct.addToCart(cartReq);
        return new ResponseData<>(HttpStatus.OK.value(), "Thêm thành công");
    }

    @Operation(
            summary = "Update Cart",
            description = "Update an item in the shopping cart based on the provided request data"
    )
    @PutMapping("/update-cart")
    public ResponseData<?> updateCart(@RequestBody CartReq cartReq) {
        this.clientProduct.updateCart(cartReq);
        return new ResponseData<>(HttpStatus.OK.value(), "Cập nhật thành công");
    }

    @Operation(
            summary = "Delete from Cart",
            description = "Delete an item from the cart using the item ID and username"
    )
    @DeleteMapping("/delete-cart/{id}/{username}")
    public ResponseData<?> deleteCart(@PathVariable String id, @PathVariable String username) {
        this.clientProduct.deleteCart(id, username);
        return new ResponseData<>(HttpStatus.OK.value(), "Xóa thành công");
    }

    @GetMapping("/user-address")
    public ResponseData<?> getUserAddress(@RequestParam Long id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get successfully user", this.clientProduct.getUserInfo(id));
    }

    @PostMapping("/order")
    public ResponseData<?> getUserAddress(@RequestBody BillClientRequest.BillCreate req) {
        return new ResponseData<>(HttpStatus.OK.value(), "Đơn hàng đang chờ xác nhận", this.clientProduct.saveBill(req));
    }
}
