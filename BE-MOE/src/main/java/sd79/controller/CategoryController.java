package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.CategoryRequest;
import sd79.dto.response.ResponseData;
import sd79.service.CategoryService;

@RestController
@RequestMapping("api/${api.version}/categories")
@Tag(name = "Category Controller", description = "Manage adding, editing, and deleting product categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @Operation(
            summary = "Get Categories",
            description = "Get all categories from database"
    )
    @GetMapping
    public ResponseData<?> getAllCategories() {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", categoryService.getAllCategories());
    }

    @Operation(
            summary = "New Categories",
            description = "New categories into database"
    )
    @PostMapping
    public ResponseData<?> storeCategory(@RequestBody CategoryRequest request){
        return new ResponseData<>(HttpStatus.OK.value(), "Thêm thành công", categoryService.storeCategory(request));
    }

    @PatchMapping("/is-delete/{id}")
    public ResponseData<?> deleteCategory(@PathVariable Integer id){
        this.categoryService.isDeleteCategory(id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Xóa thành công");
    }

}
