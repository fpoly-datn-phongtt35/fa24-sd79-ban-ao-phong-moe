package sd79.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sd79.model.Promotion;
import sd79.service.impl.PromotionServiceImpl;

@RestController
@RequestMapping("/api/${api.version}/promotion")
@RequiredArgsConstructor
public class PromotionController {
    @Autowired
    private final PromotionServiceImpl service;

    @GetMapping()
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(this.service.getAllPromotions());
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Promotion promotion){
        return ResponseEntity.ok(this.service.addPromotion(promotion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id){
        return ResponseEntity.ok(this.service.deletePromotion(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Promotion promotion){
        return ResponseEntity.ok(this.service.updatePromotion(promotion, id));
}

}
