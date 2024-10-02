package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.MaterialRequest;
import sd79.dto.response.ResponseData;
import sd79.service.MaterialService;

@RestController
@RequestMapping("api/${api.version}/material")
@Tag(name = "Material Controller", description = "Manage adding, editing, and deleting product material")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @Operation(
            summary = "Get Material",
            description = "Get all material from database"
    )
    @GetMapping
    public ResponseData<?> getAllMaterials() {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", materialService.getAllMaterials());
    }

    @Operation(
            summary = "New Material",
            description = "New material into database"
    )
    @PostMapping
    public ResponseData<?> storeBrand(@Valid @RequestBody MaterialRequest request){
        return new ResponseData<>(HttpStatus.OK.value(), "Thêm thành công", materialService.storeMaterial(request));
    }

    @Operation(
            summary = "Update Material",
            description = "Update material into database"
    )
    @PutMapping("/edit/{id}")
    public ResponseData<?> updateBrand(@Valid @RequestBody MaterialRequest request, @PathVariable int id){
        this.materialService.updateMaterial(request, id);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Cập nhật thành công");
    }

    @Operation(
            summary = "Delete Material",
            description = "Set is delete of material to true and hidde from from"
    )
    @PatchMapping("/is-delete/{id}")
    public ResponseData<?> deleteBrand(@PathVariable Integer id){
        this.materialService.isDeleteBrand(id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Xóa thành công");
    }

}
