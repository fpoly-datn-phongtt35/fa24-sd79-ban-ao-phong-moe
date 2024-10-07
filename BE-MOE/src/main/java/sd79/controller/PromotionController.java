package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.PromotionRequest;
import sd79.dto.response.ResponseData;
import sd79.model.Coupon;
import sd79.model.Promotion;
import sd79.service.impl.PromotionServiceImpl;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/${api.version}/promotion")
@RequiredArgsConstructor
public class PromotionController {
    @Autowired
    private final PromotionServiceImpl service;

    @Operation(
            summary = "Get Promotion",
            description = "Get all coupon from database"
    )
    @GetMapping
    public ResponseData<?> getPromotions() {
        return new ResponseData<>(HttpStatus.OK.value(), "List promotion", service.getAllPromotion());
    }

    @Operation(
            summary = "New Promotion",
            description = "New promotion into database"
    )
    @PostMapping("/store")
    public ResponseData<?> addPromotions(@Valid @RequestBody PromotionRequest promotionRequest) {
        return new ResponseData<>(HttpStatus.CREATED.value(), "promotion created successfully",service.storePromotion(promotionRequest));
    }

    @Operation(
            summary = "Delete Promotion",
            description = "Set is delete of promotion to true and hidde from from"
    )
    @DeleteMapping("/delete/{id}")
    public ResponseData<?> deletePromotions(@PathVariable int id) {
        service.isDeletePromotion(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Promotion deleted successfully");
    }

    @Operation(
            summary = "Update Promotion",
            description = "Update promotion into database"
    )
    @PutMapping("/update/{id}")
    public ResponseData<?> updatePromotions(@PathVariable Integer id, @Valid @RequestBody PromotionRequest promotionRequest) {
        return new ResponseData<>(HttpStatus.OK.value(), "Promotion updated successfully",service.updatePromotion(promotionRequest,id ));
    }

//    @GetMapping("/search")
//    public ResponseData<?> search(
//            @RequestParam(value = "name", required = false) String name,
//            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
//            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
//
//        List<Promotion> results = service.searchByNameAndDate(name, startDate, endDate);
//        return new ResponseData<>(HttpStatus.OK.value(), "Search results", results);
//    }
}
