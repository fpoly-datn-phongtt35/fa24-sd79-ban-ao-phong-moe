package sd79.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/${api.version}/product")
public class ProductController {
    @GetMapping
    public String getProduct() {
        return "This is the product";
    }
}
