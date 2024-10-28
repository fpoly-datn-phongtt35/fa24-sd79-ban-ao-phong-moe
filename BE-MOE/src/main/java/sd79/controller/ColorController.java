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
import sd79.dto.requests.productRequests.ColorRequest;
import sd79.dto.response.ResponseData;
import sd79.service.ColorService;

@RestController
@RequestMapping("api/${api.version}/color")
@Tag(name = "Color Controller", description = "Manage adding, editing, and deleting color")
@RequiredArgsConstructor
public class ColorController {

    private final ColorService colorService;

    @Operation(
            summary = "Get Color",
            description = "Get all color from database"
    )
    @GetMapping
    public ResponseData<?> getAllColors(@RequestParam(required = false, defaultValue = "") String keyword) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get success", this.colorService.getAllColors(keyword));
    }

    @Operation(
            summary = "New Color",
            description = "New color into database"
    )
    @PostMapping
    public ResponseData<?> storeColor(@Valid @RequestBody ColorRequest request) {
        return new ResponseData<>(HttpStatus.OK.value(), "Thêm thành công", this.colorService.storeColor(request));
    }

    @Operation(
            summary = "Update Color",
            description = "Update color into database"
    )
    @PutMapping("/edit/{id}")
    public ResponseData<?> updateColor(@Valid @RequestBody ColorRequest request, @PathVariable int id) {
        this.colorService.updateColor(request, id);
        return new ResponseData<>(HttpStatus.OK.value(), "Cập nhật thành công");
    }

    @Operation(
            summary = "Delete Color",
            description = "Set is delete of color to true and hidde from from"
    )
    @PatchMapping("/is-delete/{id}")
    public ResponseData<?> deleteColor(@PathVariable Integer id) {
        this.colorService.isDeleteColor(id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Xóa thành công");
    }
}
