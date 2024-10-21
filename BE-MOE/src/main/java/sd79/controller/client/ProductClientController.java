package sd79.controller.client;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sd79.dto.requests.common.ProductParamFilter;
import sd79.dto.response.ResponseData;
import sd79.service.ProductService;

@Slf4j
@RestController
@RequestMapping("api/${api.version}/client")
@Tag(name = "Client Controller", description = "Client controller")
@RequiredArgsConstructor
@Validated
public class ProductClientController {

    private final ProductService productService;

    @Operation(
            summary = "Get all product listings",
            description = "Get the entire product list (updating search and pagination functions)"
    )
    @GetMapping
    public ResponseData<?> getAllProducts(ProductParamFilter param) {
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved product list", this.productService.getAllProducts(param));
    }
}
