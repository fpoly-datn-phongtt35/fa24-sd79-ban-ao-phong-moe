package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import sd79.dto.requests.PromotionRequest;
import sd79.dto.response.ResponseData;
import sd79.service.PromotionService;


@RestController
@RequestMapping("/api/${api.version}/promotion")
@RequiredArgsConstructor
public class PromotionController {
    private final PromotionService promotionService;

    @Operation(
            summary = "Get Promotion",
            description = "Get all coupon from database"
    )
    @GetMapping
    public ResponseData<?> getAllPromotion() {
        return new ResponseData<>(HttpStatus.OK.value(), "List promotion", this.promotionService.getAllPromotion());
    }

    @Operation(
            summary = "Get Promotion",
            description = "Get all coupon from database"
    )
    @GetMapping("/promotion-details")
    public ResponseData<?> getAllPromotionDetail() {
        return new ResponseData<>(HttpStatus.OK.value(), "List promotion", this.promotionService.getAllPromotionDetail());
    }

    @Operation(
            summary = "New Promotion",
            description = "New promotion into database"
    )
    @PostMapping("/store")
    public ResponseData<?> storePromotions(@RequestBody PromotionRequest request) {
        return new ResponseData<>(HttpStatus.CREATED.value(), "Thêm thành công", this.promotionService.storePromotion(request));
    }

    @Operation(
            summary = "New Promotion",
            description = "New promotion into database"
    )
    @PutMapping("/update/{id}")
    public ResponseData<?> updatePromotion(@PathVariable Integer id, @Valid @RequestBody PromotionRequest req) {
        return new ResponseData<>(HttpStatus.OK.value(), "Promotion update successfully", promotionService.updatePromotion(req, id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseData<?> deletePromotions(@PathVariable int id) {
        promotionService.deleteByPromotionId(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Promotion deleted successfully");
    }

    @GetMapping("/detail/{id}")
    public ResponseData<?> getPromotionId(@PathVariable Integer id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Promotion details", promotionService.getPromotionId(id));
    }

//    @PutMapping("/update/{id}")
//    public ResponseData<?> updatePromotions(@PathVariable Integer id, @Valid @RequestBody PromotionRequest promotionRequest) {
//        return new ResponseData<>(HttpStatus.OK.value(), "Promotion updated successfully",service.updatePromotion(promotionRequest,id ));
//    }
//
//    @Operation(
//            summary = "New Promotion",
//            description = "New promotion into database"
//    )
//    @PostMapping("/store")
//    public ResponseData<?> addPromotions(@Valid @RequestBody PromotionRequest promotionRequest) {
//        return new ResponseData<>(HttpStatus.CREATED.value(), "promotion created successfully",service.storePromotion(promotionRequest));
//    }
//
//    @Operation(
//            summary = "New Promotion",
//            description = "New promotion into database"
//    )
//    @PostMapping("/store/product")
//    public ResponseData<?> addPromotions(@Valid @RequestBody PromotionProductReq promotionProductReq) {
//        return new ResponseData<>(HttpStatus.CREATED.value(), "promotion created successfully",service.storeProductPromotion(promotionProductReq));
//    }
//
//    @Operation(
//            summary = "Delete Promotion",
//            description = "Set is delete of promotion to true and hidde from from"
//    )
//    @DeleteMapping("/delete/{id}")
//    public ResponseData<?> deletePromotions(@PathVariable int id) {
//        service.isDeletePromotion(id);
//        return new ResponseData<>(HttpStatus.OK.value(), "Promotion deleted successfully");
//    }
//
//    @Operation(
//            summary = "Update Promotion",
//            description = "Update promotion into database"
//    )
//
//    @GetMapping("/searchKeywordAndDate")
//    public ResponseData<?> searchKeywordAndDate(
//            @RequestParam(value = "keyword", required = false) String keyword,
//            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
//            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate,
//            @RequestParam(value = "status", required = false) String status,
//            @RequestParam(value = "page", defaultValue = "0") int page,
//            @RequestParam(value = "size", defaultValue = "5") int size,
//            @RequestParam(value = "sort", defaultValue = "startDate") String sort,
//            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {
//
//        // Determine sort direction
//        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
//
//        // Apply sorting using Sort class
//        Sort sortBy = Sort.by(sortDirection, sort);
//
//        // Create pageable object with sorting
//        Pageable pageable = PageRequest.of(page, size, sortBy);
//
//        // Fetch paginated and sorted data
//        Page<PromotionResponse> results = service.findByKeywordAndDate(
//                keyword, startDate, endDate, status, pageable);
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("content", results.getContent());
//        response.put("totalPages", results.getTotalPages());
//        response.put("totalElements", results.getTotalElements());
//
//        return new ResponseData<>(HttpStatus.OK.value(), "List coupon", response);
//    }
}
