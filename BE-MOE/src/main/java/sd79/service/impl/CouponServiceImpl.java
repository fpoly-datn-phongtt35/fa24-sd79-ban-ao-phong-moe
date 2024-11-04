package sd79.service.impl;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.CouponImageReq;
import sd79.dto.requests.CouponRequest;
import sd79.dto.requests.common.CouponParamFilter;
import sd79.dto.response.CouponCustomerResponse;
import sd79.dto.response.CouponResponse;
import sd79.dto.response.PageableResponse;
import sd79.enums.TodoDiscountType;
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

import java.text.SimpleDateFormat;
import java.util.List;
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
    public PageableResponse getAllCouponDate(CouponParamFilter param) {

        if (param.getPageNo() < 1) {
            param.setPageNo(1);
        }
        return this.couponCustomizeQuery.getAllCouponDate(param);
    }

    @Override
    public PageableResponse getAllCouponDatePersonal(CouponParamFilter param) {

        if (param.getPageNo() < 1) {
            param.setPageNo(1);
        }
        return this.couponCustomizeQuery.getAllCouponDatePersonal(param);
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
                .usageCount(couponRequest.getUsageCount())
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

    @Override
    public void sendCouponEmail(Coupon coupon, Customer customer) {
        try {
            CouponImage couponImage = findByImage(coupon.getId());
            String imageUrl = couponImage.getImageUrl();
            String subject = "Thông Báo Phiếu Giảm Giá";
            String discountType = coupon.getDiscountType() == TodoDiscountType.PERCENTAGE ? "%" : "VND";
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");
            String formattedStartDate = dateFormat.format(coupon.getStartDate());
            String formattedEndDate = dateFormat.format(coupon.getEndDate());

            String body = String.format(
                    "<div style=\"font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;\">" +
                            "<div style=\"max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);\">" +
                            "<div style=\"text-align: center;\">" +
                            "<img src=\"https://res.cloudinary.com/dp0odec5s/image/upload/v1729760620/c6gyppm7eef7cyo0vxzy.jpg\" alt=\"Logo\" style=\"max-width: 120px; margin-bottom: 20px;\" />" +
                            "<h1 style=\"font-size: 24px; color: #333; margin: 0 0 10px;\">🎉 Bạn có một phiếu giảm giá đặc biệt! 🎉</h1>" +
                            "<p style=\"font-size: 18px; color: #ff6f61; margin: 0;\">Thông Tin Phiếu Giảm Giá - %s</p>" +
                            "</div>" +
                            "<p style=\"font-size: 16px; color: #555; line-height: 1.6; text-align: center;\">Xin chào <strong style='color:#ff6f61;'>%s</strong>, chúng tôi rất vui mừng thông báo rằng bạn có một phiếu giảm giá đặc biệt cho lần mua sắm tiếp theo của mình!</p>" +
                            "<div style=\"background-image: url('%s'); background-size: cover; padding: 20px; text-align: center; color: white; border-radius: 10px; margin: 20px 0;\">" +
                            "<strong style=\"font-size: 24px;\">Giảm %s %s</strong><br />" +
                            "<p style=\"font-size: 16px;\">Mã phiếu giảm giá: <strong style='color:#e74c3c;'>%s</strong></p>" +
                            "<p style=\"font-size: 16px;\">Có hiệu lực từ <strong>%s</strong> đến <strong>%s</strong></p>" +
                            "</div>" +
                            "<p style=\"font-size: 16px; color: #555; text-align: center;\">Hãy sử dụng mã này khi bạn mua sắm trên trang web của chúng tôi để nhận được ưu đãi đặc biệt.</p>" +
                            "<div style=\"text-align: center;\">" +
                            "<a href=\"http://localhost:1004/\" style=\"display: inline-block; padding: 15px 30px; background-color: #ff6f61; color: white; font-size: 18px; border-radius: 8px; text-decoration: none;\">Xem Chi Tiết</a>" +
                            "</div>" +
                            "<p style=\"font-size: 14px; color: #aaa; text-align: center; margin-top: 30px;\">Cảm ơn bạn đã ủng hộ chúng tôi!</p>" +
                            "</div>" +
                            "</div>",
                    coupon.getName(),
                    customer.getFirstName(), imageUrl,
                    coupon.getDiscountValue(), discountType, coupon.getCode(),
                    formattedStartDate, formattedEndDate
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

    @Override
    public Coupon findCouponById(Long id) {
        return this.couponRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Coupon not found"));
    }

    @Override
    public Customer findCustomerById(Long id) {
        return this.customerRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Coupon not found"));
    }

    @Transactional
    @Override
    public long updateCoupon(Long id, CouponRequest couponRequest) {
        Coupon coupon = couponRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));

        if (!coupon.getCode().equals(couponRequest.getCode()) &&
                couponRepo.existsCouponByAttribute(couponRequest.getCode())) {
            throw new EntityExistsException("Mã phiếu giảm giá đã tồn tại!");
        }

        coupon.setCode(couponRequest.getCode());
        coupon.setName(couponRequest.getName());
        coupon.setDiscountValue(couponRequest.getDiscountValue());
        coupon.setDiscountType(couponRequest.getDiscountType());
        coupon.setMaxValue(couponRequest.getMaxValue());
        coupon.setQuantity(couponRequest.getQuantity());
        coupon.setUsageCount(coupon.getUsageCount());
        coupon.setConditions(couponRequest.getConditions());
        coupon.setType(couponRequest.getType());
        coupon.setStartDate(couponRequest.getStartDate());
        coupon.setEndDate(couponRequest.getEndDate());
        coupon.setDescription(couponRequest.getDescription());
        coupon.setUpdatedBy(getUserById(couponRequest.getUserId()));

        if (couponRequest.getType() == TodoType.PERSONAL) {
            if (couponRequest.getCustomerIds() == null || couponRequest.getCustomerIds().isEmpty()) {
                throw new IllegalArgumentException("ID khách hàng không có");
            }

            couponShareRepo.deleteAll(couponShareRepo.findByCoupon(coupon));

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
            deleteCouponShare(coupon.getId());
        }
        return couponRepo.save(coupon).getId();
    }

    @Transactional
    @Override
    public void deleteCoupon(Long id) {//xoa phieu giam gia
        Coupon coupon = couponRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        couponRepo.delete(coupon);
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

    public void deleteCouponShare(Long couponId) {
        Coupon coupon = couponRepo.findById(couponId)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        List<CouponShare> couponShares = couponShareRepo.findByCoupon(coupon);
        couponShareRepo.deleteAll(couponShares);
    }

    private CouponResponse convertCouponResponse(Coupon coupon) {

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
                .usageCount(coupon.getUsageCount())
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
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy user"));
    }

    private String convertToUrl(CouponImage image) {
        return (image != null) ? image.getImageUrl() : null;
    }
//-----------------------------------------------------------------------------------------------
//    public List<CouponCustomerResponse> getAllCouponCustomers(Long customerId) {
//        List<CouponCustomerResponse> coupons;
//
//        if (customerId == null || !customerRepository.existsById(customerId)) {
//            // Lấy các phiếu giảm giá có trạng thái "BẮT ĐẦU" và isDeleted = false
//            coupons = couponRepo.findAllByStatusAndIsDeleted("START", false)
//                    .stream()
//                    .map(this::convertToCouponCustomerResponse)
//                    .collect(Collectors.toList());
//        } else {
//            // Lấy tất cả các phiếu giảm giá liên quan đến khách hàng
//            coupons = couponRepo.findAllByCustomerId(customerId)
//                    .stream()
//                    .map(this::convertToCouponCustomerResponse)
//                    .collect(Collectors.toList());
//        }
//
//        return coupons;
//    }
//
//    private CouponCustomerResponse convertToCouponCustomerResponse(Coupon coupon) {
//        return CouponCustomerResponse.builder()
//                .id(coupon.getId())
//                .code(coupon.getCode())
//                .name(coupon.getName())
//                .type(coupon.getType())
//                .discountValue(coupon.getDiscountValue())
//                .discountType(coupon.getDiscountType())
//                .maxValue(coupon.getMaxValue())
//                .quantity(coupon.getQuantity())
//                .usageCount(coupon.getUsageCount())
//                .conditions(coupon.getConditions())
//                .startDate(coupon.getStartDate())
//                .endDate(coupon.getEndDate())
//                .status(coupon.getStatus())
//                .description(coupon.getDescription())
//                .imageUrl(coupon.getCouponImage() != null ? coupon.getCouponImage().getImageUrl() : null)
//                .customers(coupon.getCouponShares().stream()
//                        .map(CouponShare::getCustomer)
//                        .collect(Collectors.toList()))
//                .build();
//    }
}
