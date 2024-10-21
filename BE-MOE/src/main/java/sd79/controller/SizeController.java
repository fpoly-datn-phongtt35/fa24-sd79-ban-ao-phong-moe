package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.productRequests.SizeRequest;
import sd79.dto.response.ResponseData;
import sd79.service.SizeService;

@RestController
@RequestMapping("api/${api.version}/size")
@Tag(name = "Size Controller", description = "Manage adding, editing, and deleting size")
@RequiredArgsConstructor
public class SizeController {

    private final SizeService sizeService;

    @Operation(
            summary = "Get Size",
            description = "Get all size from database"
    )
    @GetMapping
    public ResponseData<?> getAllSizes(){
        return new ResponseData<>(HttpStatus.OK.value(), "Get success", this.sizeService.getAllSizes());
    }

    @Operation(
            summary = "New Size",
            description = "New size into database"
    )
    @PostMapping
    public ResponseData<?> storeSize(@Valid @RequestBody SizeRequest request){
        return new ResponseData<>(HttpStatus.OK.value(), "Thêm thành công", this.sizeService.storeSize(request));
    }

    @Operation(
            summary = "Update Size",
            description = "Update size into database"
    )
    @PutMapping("/edit/{id}")
    public ResponseData<?> updateSize(@Valid @RequestBody SizeRequest request, @PathVariable int id){
        this.sizeService.updateSize(request, id);
        return new ResponseData<>(HttpStatus.OK.value(), "Cập nhật thành công");
    }

    @Operation(
            summary = "Delete Size",
            description = "Set is delete of size to true and hidde from from"
    )
    @PatchMapping("/is-delete/{id}")
    public ResponseData<?> deleteSize(@PathVariable Integer id){
        this.sizeService.isDeleteSize(id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Xóa thành công");
    }
}
