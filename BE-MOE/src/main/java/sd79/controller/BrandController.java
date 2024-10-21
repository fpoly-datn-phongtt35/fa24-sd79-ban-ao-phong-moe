package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.productRequests.BrandRequest;
import sd79.dto.response.ResponseData;
import sd79.service.BrandService;

@RestController
@RequestMapping("api/${api.version}/brand")
@Tag(name = "Brand Controller", description = "Manage adding, editing, and deleting product brand")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @Operation(
            summary = "Get Brand",
            description = "Get all brand from database"
    )
    @GetMapping
    public ResponseData<?> getAllBrands() {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", brandService.getAllBrands());
    }

    @Operation(
            summary = "New Brand",
            description = "New brand into database"
    )
    @PostMapping
    public ResponseData<?> storeBrand(@Valid @RequestBody BrandRequest request){
        return new ResponseData<>(HttpStatus.OK.value(), "Thêm thành công", brandService.storeBrand(request));
    }

    @Operation(
            summary = "Update Brand",
            description = "Update brand into database"
    )
    @PutMapping("/edit/{id}")
    public ResponseData<?> updateBrand(@Valid @RequestBody BrandRequest request, @PathVariable int id){
        this.brandService.updateBrand(request, id);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Cập nhật thành công");
    }

    @Operation(
            summary = "Delete Brand",
            description = "Set is delete of brand to true and hidde from from"
    )
    @PatchMapping("/is-delete/{id}")
    public ResponseData<?> deleteBrand(@PathVariable Integer id){
        this.brandService.isDeleteBrand(id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Xóa thành công");
    }

}
