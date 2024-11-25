package sd79.service.impl;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.PromotionRequest;
import sd79.dto.response.PromotionDetailResponse;
import sd79.dto.response.PromotionResponse;
import sd79.exception.EntityNotFoundException;
import sd79.exception.InvalidDataException;
import sd79.model.*;
import sd79.repositories.auth.UserRepository;
import sd79.repositories.products.ProductRepository;
import sd79.repositories.promotions.PromotionDetailRepository;
import sd79.repositories.promotions.PromotionRepository;
import sd79.service.PromotionService;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor    
public class PromotionsServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;

    private final PromotionDetailRepository promotionDetailRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    private boolean containsSpecialCharacters(String input) {
        // Biểu thức chính quy kiểm tra ký tự đặc biệt
        String regex = "^[a-zA-Z0-9\\s]+$"; // Cho phép chữ cái, số, và khoảng trắng
        return !input.matches(regex);
    }


    @Override
    public List<PromotionResponse> getAllPromotion() {
        return this.promotionRepository.findAll().stream().map(item ->
                PromotionResponse.builder()
                        .id(item.getId())
                        .name(item.getName())
                        .code(item.getCode())
                        .percent(item.getPercent())
                        .startDate(item.getStartDate())
                        .endDate(item.getEndDate())
                        .note(item.getNote())
                        .build()
        ).toList();
    }

    @Override
    public PromotionResponse getPromotionId(Integer id) {
        Promotion promotion = this.promotionRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Đợt giảm giá không tồn tại"));
        return convertPromotionResponsse(promotion);
    }

    @Override
    public List<PromotionDetailResponse> getAllPromotionDetail(){
        return this.promotionDetailRepository.findAll().stream().map(item ->
                PromotionDetailResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .promotionId(item.getPromotion().getId())
                        .build()
        ).toList();
    }

    @Override
    public Integer storePromotion(PromotionRequest req) {
        // Kiểm tra tất cả các sản phẩm xem có sản phẩm nào đã có khuyến mãi trước đó không
        for (Long productId : req.getProductIds()) {
            if (promotionDetailRepository.findActivePromotionByProductId(productId).isPresent()) {
                throw new InvalidDataException("Sản phẩm với ID " + productId + " đã được áp dụng khuyến mãi trước đó.");
            }
        }

        // Kiểm tra trùng tên đợt giảm giá
        if (promotionRepository.existsByName(req.getName())) {
            throw new InvalidDataException("Tên đợt giảm giá \"" + req.getName() + "\" đã tồn tại.");
        }

        // Kiểm tra trùng mã đợt giảm giá
        if (promotionRepository.existsByCode(req.getCode())) {
            throw new InvalidDataException("Mã đợt giảm giá \"" + req.getCode() + "\" đã tồn tại.");
        }

        // Nếu không có lỗi, tiến hành tạo đợt giảm giá mới
        Promotion promotion = this.promotionRepository.save(Promotion.builder()
                .name(req.getName())
                .percent(req.getPercent())
                .code(req.getCode())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .note(req.getNote())
                .build());

        // Thêm các chi tiết khuyến mãi cho từng sản phẩm
        for (Long productId : req.getProductIds()) {
            PromotionDetail promotionDetail = PromotionDetail.builder()
                    .promotion(promotion)
                    .product(getProduct(productId))
                    .build();

            // Lưu chi tiết khuyến mãi vào cơ sở dữ liệu
            this.promotionDetailRepository.save(promotionDetail);
        }

        // Trả về ID của đợt khuyến mãi đã lưu
        return promotion.getId();
    }


    @Override
    public Integer updatePromotion(PromotionRequest req, Integer id) {
        Promotion promotion = this.promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt giảm giá với id " + id));

        // Kiểm tra trùng tên đợt giảm giá (trừ chính nó)
        if (promotionRepository.existsByNameAndIdNot(req.getName(), id)) {
            throw new InvalidDataException("Tên đợt giảm giá \"" + req.getName() + "\" đã tồn tại.");
        }

        // Kiểm tra trùng mã đợt giảm giá (trừ chính nó)
        if (promotionRepository.existsByCodeAndIdNot(req.getCode(), id)) {
            throw new InvalidDataException("Mã đợt giảm giá \"" + req.getCode() + "\" đã tồn tại.");
        }

        // Cập nhật thông tin khuyến mãi
        promotion.setName(req.getName());
        promotion.setPercent(req.getPercent());
        promotion.setCode(req.getCode());
        promotion.setStartDate(req.getStartDate());
        promotion.setEndDate(req.getEndDate());
        promotion.setNote(req.getNote());
        populatePromotionData(promotion, req);

        // Lưu lại thông tin đã cập nhật
        this.promotionRepository.save(promotion);

        List<Long> existingProductIds = promotion.getPromotionDetails().stream()
                .map(detail -> detail.getProduct().getId())
                .collect(Collectors.toList());

        // Xóa các chi tiết khuyến mãi không còn trong danh sách productIds từ request
        for (PromotionDetail detail : new ArrayList<>(promotion.getPromotionDetails())) {
            if (!req.getProductIds().contains(detail.getProduct().getId())) {
                this.promotionDetailRepository.delete(detail);
                promotion.getPromotionDetails().remove(detail);
            }
        }

        // Thêm mới các PromotionDetail cho các productIds chưa có trong existingProductIds
        for (Long productId : req.getProductIds()) {
            if (!existingProductIds.contains(productId)) {
                PromotionDetail promotionDetail = PromotionDetail.builder()
                        .promotion(promotion)
                        .product(getProduct(productId))
                        .build();
                this.promotionDetailRepository.save(promotionDetail);
                promotion.getPromotionDetails().add(promotionDetail);
            }
        }
        return promotion.getId();
    }


    @Override
    public void deleteByPromotionId(Integer id) {
        Promotion promotion = this.promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt giảm giá với id id " + id));

        promotionDetailRepository.deleteByPromotionId(id);

        promotionRepository.delete(promotion);

    }

    private void populatePromotionData(Promotion promotion, PromotionRequest promotionRequest) {//lay du lieu dot giam gia request de them
        promotion.setName(promotionRequest.getName());
        promotion.setCode(promotionRequest.getCode());
        promotion.setPercent(promotionRequest.getPercent());
        promotion.setStartDate(promotionRequest.getStartDate());
        promotion.setEndDate(promotionRequest.getEndDate());
        promotion.setNote(promotionRequest.getNote());
//        promotion.setPromotionDetails(promotionRequest.getProductIds());
    }

    private PromotionResponse convertPromotionResponsse(Promotion promotion){
        List<Product> products = promotion.getPromotionDetails().stream()
                .map(PromotionDetail::getProduct)
                .collect(Collectors.toList());
        List<Long> list = new ArrayList<>();

        products.forEach(i -> {
            list.add(i.getId());
        });
        return PromotionResponse.builder()
                .id(promotion.getId())
                .name(promotion.getName())
                .code(promotion.getCode())
                .percent(promotion.getPercent())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .note(promotion.getNote())
                .listIdProduct(list)
                .build();
    }

    @Transactional
    @Override
    public Page<PromotionResponse> searchPromotions(Date startDate, Date endDate, String name, Pageable pageable) {
        // Validate chuỗi tìm kiếm
        if (name != null && !name.isEmpty() && containsSpecialCharacters(name)) {
            throw new InvalidDataException("Tên tìm kiếm không được chứa ký tự đặc biệt.");
        }

        Page<Promotion> promotions = promotionRepository.searchPromotions(startDate, endDate, name, pageable);
        return promotions.map(this::convertPromotionResponsse);  // Convert entity to response DTO
    }

    @Override
    public Page<PromotionResponse> findByKeywordAndDate(String keyword, Date startDate, Date endDate,
                                                        String status, Pageable pageable) {
        // Validate các chuỗi tìm kiếm
        if (keyword != null && !keyword.isEmpty() && containsSpecialCharacters(keyword)) {
            throw new InvalidDataException("Từ khóa tìm kiếm không được chứa ký tự đặc biệt.");
        }
        if (status != null && !status.isEmpty() && containsSpecialCharacters(status)) {
            throw new InvalidDataException("Trạng thái tìm kiếm không được chứa ký tự đặc biệt.");
        }

        Page<Promotion> promotions;

        // Kiểm tra nếu không có điều kiện tìm kiếm, trả về toàn bộ danh sách
        if ((keyword == null || keyword.isEmpty()) && startDate == null && endDate == null &&
                (status == null || status.isEmpty())) {
            promotions = promotionRepository.findAll(pageable);  // Lấy toàn bộ danh sách với phân trang
        } else {
            // Nếu có điều kiện tìm kiếm, gọi hàm findByKeywordAndDate
            promotions = promotionRepository.findByKeywordAndDate(keyword, startDate, endDate, status, pageable);
        }
        return promotions.map(this::convertPromotionResponsse);
    }

    @Override
    public Page<PromotionResponse> getPromotion(Pageable pageable) {
        return promotionRepository.findAll(pageable).map(this::convertPromotionResponsse);
    }

    private Product getProduct(Long id) {
        return this.productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Sản phẩm không tồn tại!"));
    }

    private User getUser(Long id){
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User không tồn tại!"));
    }
}
