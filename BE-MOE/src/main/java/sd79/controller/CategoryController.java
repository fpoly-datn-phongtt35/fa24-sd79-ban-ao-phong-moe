/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.productRequests.CategoryRequest;
import sd79.dto.response.ResponseData;
import sd79.service.CategoryService;

@RestController
@RequestMapping("api/${api.version}/categories")
@Tag(name = "Category Controller", description = "Manage adding, editing, and deleting product Category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @Operation(
            summary = "Get Category",
            description = "Get all Category from database"
    )
    @GetMapping
    public ResponseData<?> getAllCategories(@RequestParam(required = false, defaultValue = "") String keyword) {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", categoryService.getAllCategories(keyword));
    }

    @Operation(
            summary = "New Category",
            description = "New Category into database"
    )
    @PostMapping
    public ResponseData<?> storeCategory(@Valid @RequestBody CategoryRequest request){
        return new ResponseData<>(HttpStatus.OK.value(), "Thêm thành công", categoryService.storeCategory(request));
    }

    @Operation(
            summary = "Update Category",
            description = "Update category into database"
    )
    @PutMapping("/edit/{id}")
    public ResponseData<?> updateCategory(@Valid @RequestBody CategoryRequest request, @PathVariable int id){
        this.categoryService.updateCategory(request, id);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Cập nhật thành công");
    }

    @Operation(
            summary = "Delete Category",
            description = "Set is delete of category to true and hidde from from"
    )
    @PatchMapping("/is-delete/{id}")
    public ResponseData<?> deleteCategory(@PathVariable Integer id){
        this.categoryService.isDeleteCategory(id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Xóa thành công");
    }

}
