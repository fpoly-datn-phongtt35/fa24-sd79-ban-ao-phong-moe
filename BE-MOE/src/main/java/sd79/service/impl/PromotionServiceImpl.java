package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.model.Promotion;
import sd79.repositories.PromotionRepo;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

    public class PromotionServiceImpl {
    private final PromotionRepo promotionRepo;

    public List<?> getAllPromotions() {
        return this.promotionRepo.findAll();
    }

    public Promotion addPromotion(Promotion promotion) {
        return this.promotionRepo.save(promotion);
    }

    public String deletePromotion(int id) {
        try{
            this.promotionRepo.deleteById(id);
            return "Delete success";
        }catch(Exception e){
            return "Delete failed";
        }
    }

    public Promotion updatePromotion(Promotion promotion, Integer id) {
        Optional<Promotion> optional = this.promotionRepo.findById(id);
        return optional.map(o ->{
            o.setId(promotion.getId());
            o.setName(promotion.getName());
            o.setPromotionType(promotion.getPromotionType());
            o.setPromotionValue(promotion.getPromotionValue());
            o.setStartDate(promotion.getStartDate());
            o.setEndDate(promotion.getEndDate());
            o.setDescription(promotion.getDescription());
            return this.promotionRepo.save(o);
        }).orElse(null);
    }

}
