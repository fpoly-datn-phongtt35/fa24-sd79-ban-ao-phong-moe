package sd79.service.impl;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.CouponImageReq;
import sd79.dto.requests.CouponRequest;
import sd79.dto.requests.common.CouponParamFilter;
import sd79.dto.response.CouponResponse;
import sd79.dto.response.PageableResponse;
import sd79.enums.TodoType;
import sd79.exception.EntityNotFoundException;
import sd79.model.*;
import sd79.repositories.CouponImageRepo;
import sd79.repositories.CouponRepo;
import sd79.repositories.CouponShareRepo;
import sd79.repositories.CustomerRepository;
import sd79.repositories.auth.UserRepository;
import sd79.repositories.customQuery.CouponCustomizeQuery;
import sd79.service.CouponService;
import sd79.utils.CloudinaryUploadCoupon;
import sd79.utils.Email;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepo couponRepo;
    private final UserRepository userRepository;
    private final CloudinaryUploadCoupon cloudinaryUploadCoupon;
    private final CouponCustomizeQuery couponCustomizeQuery;
    private final CouponImageRepo couponImageRepo;
    private final CustomerRepository customerRepository;
    private final CouponShareRepo couponShareRepo;
    private final Email email;

    @Override
    public PageableResponse getAllCoupon(CouponParamFilter param) {

        if (param.getPageNo() < 1) {
            param.setPageNo(1);
        }

        return this.couponCustomizeQuery.getAllCoupons(param);
    }

    @Override
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        return convertCouponResponse(coupon);
    }

    @Transactional
    @Override
    public long storeCoupon(CouponRequest couponRequest) {
        if (this.couponRepo.existsCouponByAttribute(couponRequest.getCode())) {
            throw new EntityExistsException("Mã phiếu giảm giá đã tồn tại!");
        }

        Coupon coupon = Coupon.builder()
                .code(couponRequest.getCode())
                .name(couponRequest.getName())
                .discountValue(couponRequest.getDiscountValue())
                .discountType(couponRequest.getDiscountType())
                .maxValue(couponRequest.getMaxValue())
                .quantity(couponRequest.getQuantity())
                .conditions(couponRequest.getConditions())
                .type(couponRequest.getType())
                .startDate(couponRequest.getStartDate())
                .endDate(couponRequest.getEndDate())
                .description(couponRequest.getDescription())
                .build();

        coupon.setCreatedBy(getUserById(couponRequest.getUserId()));
        coupon.setUpdatedBy(getUserById(couponRequest.getUserId()));
        coupon = couponRepo.save(coupon);

        if (couponRequest.getType() == TodoType.PERSONAL) {
            if (couponRequest.getCustomerIds() == null || couponRequest.getCustomerIds().isEmpty()) {
                throw new IllegalArgumentException("ID khách hàng không có");
            }

            for (Long customerId : couponRequest.getCustomerIds()) {
                Customer customer = this.customerRepository.findById(customerId)
                        .orElseThrow(() -> new EntityNotFoundException("ID khách hàng là: " + customerId));
                CouponShare couponShare = new CouponShare();
                couponShare.setCoupon(coupon);
                couponShare.setCustomer(customer);
                couponShare.setIsDeleted(false);
                couponShareRepo.save(couponShare);
            }
        }

        return coupon.getId();
    }

    private void sendCouponEmail(Coupon coupon, Customer customer) {
        try {
            // Lấy hình ảnh mỗi lần gửi cho khách hàng mới
            CouponImage couponImage = findByImage(coupon.getId());
            String imageUrl = couponImage.getImageUrl();  // Đảm bảo lấy lại URL ảnh cho từng người nhận

            String subject = "Thông Báo Phiếu Giảm Giá";
            String body = String.format(
                    "<div style=\"font-family:Arial, sans-serif; background-color:#f8f8f8; padding:20px; text-align:center;\">" +
                            "<h2 style=\"color:#f37021;\">Bạn có một phiếu giảm giá: %s</h2>" +
                            "<div style=\"background-color:white; padding:20px; max-width:600px; margin:auto; border-radius:10px;\">" +
                            "<h3 style=\"color:#333;\">Thông Báo Phiếu Giảm Giá</h3>" +
                            "<p style=\"color:#666;\">Xin chào %s,</p>" +
                            "<p style=\"color:#666;\">Chúng tôi vô cùng vui mừng thông báo rằng bạn có một phiếu giảm giá đặc biệt.</p>" +
                            "<div style=\"background-image: url('%s'); " +
                            "background-size: cover; padding:40px; border-radius:8px; font-size:16px; color:#333;\">" +
                            "<strong>Giảm %s%% Có hiệu lực từ: %s đến %s</strong>" +
                            "</div>" +
                            "<p style=\"color:#666;\">Hãy sử dụng phiếu giảm giá này khi bạn mua sắm trên trang web của chúng tôi để nhận được ưu đãi đặc biệt.</p>" +
                            "<a href=\"#\" style=\"display:inline-block; padding:10px 20px; background-color:#333; color:white; text-decoration:none; border-radius:5px;\">Xem Chi Tiết</a>" +
                            "<p style=\"color:#999; font-size:12px;\">Cảm ơn bạn đã ủng hộ chúng tôi!</p>" +
                            "</div>" +
                            "</div>",
                    coupon.getName(), customer.getFirstName(), imageUrl,
                    coupon.getDiscountValue(), coupon.getStartDate(), coupon.getEndDate()
            );

            email.sendEmail(customer.getUser().getEmail(), subject, body);
        } catch (Exception e) {
            System.out.println("THAT BAI: " + e.getMessage());
        }
    }


    public CouponImage findByImage(Long couponId) {
        return this.couponImageRepo.findByCouponId(couponId)
                .orElseThrow(() -> new EntityNotFoundException("Coupon not found"));
    }

    @Transactional
    @Override
    public void storeCouponImages(CouponImageReq req) {
        Coupon coupon = this.findCouponById(req.getCouponID());
        CouponImage couponImage = coupon.getCouponImage();

        if (couponImage != null && couponImage.getPublicId() != null) {
            cloudinaryUploadCoupon.delete(couponImage.getPublicId());
            couponImageRepo.delete(couponImage);
        }

        String imageUrl = cloudinaryUploadCoupon.upload(req.getImages());
        String publicId = extractPublicId(imageUrl);
        CouponImage newCouponImage = new CouponImage();
        newCouponImage.setCoupon(coupon);
        newCouponImage.setImageUrl(imageUrl);
        newCouponImage.setPublicId(publicId);
        couponImageRepo.save(newCouponImage);

        if (coupon.getType() == TodoType.PERSONAL) {
            List<CouponShare> sharedCoupons = couponShareRepo.findByCoupon(coupon);
            for (CouponShare couponShare : sharedCoupons) {
                Customer customer = couponShare.getCustomer();
                sendCouponEmail(coupon, customer);
            }
        }
    }


    private String extractPublicId(String url) {
        String[] parts = url.split("/upload/");
        if (parts.length > 1) {
            String pathAfterUpload = parts[1];
            String[] pathParts = pathAfterUpload.split("/");
            String publicIdWithExtension = pathParts[pathParts.length - 1];
            return publicIdWithExtension.split("\\.")[0];
        } else {
            throw new IllegalArgumentException("Invalid Cloudinary URL format");
        }
    }


    public Coupon findCouponById(Long id) {
        return this.couponRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Coupon not found"));
    }

    @Transactional
    @Override
    public long updateCoupon(Long id, CouponRequest couponRequest) {
        Coupon coupon = couponRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));

        // Check if the coupon code is being updated and if it already exists in the system
        if (!coupon.getCode().equals(couponRequest.getCode()) &&
                couponRepo.existsCouponByAttribute(couponRequest.getCode())) {
            throw new EntityExistsException("Mã phiếu giảm giá đã tồn tại!");
        }

        // Update coupon attributes
        coupon.setCode(couponRequest.getCode());
        coupon.setName(couponRequest.getName());
        coupon.setDiscountValue(couponRequest.getDiscountValue());
        coupon.setDiscountType(couponRequest.getDiscountType());
        coupon.setMaxValue(couponRequest.getMaxValue());
        coupon.setQuantity(couponRequest.getQuantity());
        coupon.setConditions(couponRequest.getConditions());
        coupon.setType(couponRequest.getType());
        coupon.setStartDate(couponRequest.getStartDate());
        coupon.setEndDate(couponRequest.getEndDate());
        coupon.setDescription(couponRequest.getDescription());
        coupon.setUpdatedBy(getUserById(couponRequest.getUserId()));

        // Check if the type is PERSONAL
        if (couponRequest.getType() == TodoType.PERSONAL) {
            if (couponRequest.getCustomerIds() == null || couponRequest.getCustomerIds().isEmpty()) {
                throw new IllegalArgumentException("ID khách hàng không có");
            }

            // Remove existing CouponShare records for the coupon
            couponShareRepo.deleteAll(couponShareRepo.findByCoupon(coupon));

            // Add new CouponShare records for each customer in the request
            for (Long customerId : couponRequest.getCustomerIds()) {
                Customer customer = customerRepository.findById(customerId)
                        .orElseThrow(() -> new EntityNotFoundException("ID khách hàng là: " + customerId));

                CouponShare couponShare = new CouponShare();
                couponShare.setCoupon(coupon);
                couponShare.setCustomer(customer);
                couponShare.setIsDeleted(false);
                couponShareRepo.save(couponShare);
            }
        } else {
            // If type is not PERSONAL (assumed PUBLIC), execute deleteCouponShare
            deleteCouponShare(coupon.getId());
        }

        // Save the updated coupon and return its ID
        return couponRepo.save(coupon).getId();
    }



    @Transactional
    @Override
    public void deleteCoupon(Long id) {//xoa phieu giam gia
        Coupon coupon = couponRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        couponRepo.delete(coupon);
    }

    public void deleteCouponShare(Long couponId) {
        Coupon coupon = couponRepo.findById(couponId)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        List<CouponShare> couponShares = couponShareRepo.findByCoupon(coupon);
        couponShareRepo.deleteAll(couponShares);
    }

    @Override
    public void deleteCouponImage(Long couponId) {
        Coupon coupon = this.findCouponById(couponId);
        CouponImage couponImage = coupon.getCouponImage();
        if (couponImage != null && couponImage.getPublicId() != null) {
            cloudinaryUploadCoupon.delete(couponImage.getPublicId());
            couponImageRepo.delete(couponImage);
        } else {
            throw new RuntimeException("Coupon image not found or public ID is null");
        }
    }


    private CouponResponse convertCouponResponse(Coupon coupon) {//lay du lieu phieu giam gia respone de hien thi danh sach

        List<Customer> customers = coupon.getCouponShares().stream()
                .map(CouponShare::getCustomer)
                .collect(Collectors.toList());

        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .type(coupon.getType())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .maxValue(coupon.getMaxValue())
                .quantity(coupon.getQuantity())
                .conditions(coupon.getConditions())
                .startDate(coupon.getStartDate())
                .endDate(coupon.getEndDate())
                .status(coupon.getStatus())
                .description(coupon.getDescription())
                .imageUrl(convertToUrl(coupon.getCouponImage()))
                .customers(customers)
                .build();
    }

    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private String convertToUrl(CouponImage image) {
        return (image != null) ? image.getImageUrl() : null;
    }


}
