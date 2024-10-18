package sd79.service.impl;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import sd79.dto.requests.CouponImageReq;
import sd79.dto.requests.CouponRequest;
import sd79.dto.requests.common.CouponParamFilter;
import sd79.dto.response.CouponResponse;
import sd79.dto.response.PageableResponse;
import sd79.enums.ProductStatus;
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
import sd79.service.ProductService;
import sd79.utils.CloudinaryUpload;
import sd79.utils.CloudinaryUploadCoupon;
import sd79.utils.Email;

import java.util.Date;
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
                try {
                    String subject = "Thông Báo Phiếu Giảm Giá";
                    String body = String.format(
                            "<div class=\"email-container\">" +
                                    "<h1>Bạn có một phiếu giảm giá: %s</h1>" +
                                    "<p>Xin chào %s,</p>" +
                                    "<p>Bạn vừa nhận được một phiếu giảm giá đặc biệt. Hãy sử dụng nó để nhận ưu đãi!</p>" +
                                    "<div class=\"voucher\">Mã giảm giá: <span>%s</span></div>" +
                                    "<p>Giá trị: %s %s</p>" +
                                    "<p>Ngày bắt đầu: %s</p>" +
                                    "<p>Ngày hết hạn: %s</p>" +
                                    "</div>",
                            coupon.getName(), customer.getFirstName(), coupon.getCode(),
                            coupon.getDiscountValue(), coupon.getDiscountType(),
                            coupon.getStartDate(), coupon.getEndDate()
                    );
                 email.sendEmail(null, subject, body);
                } catch (Exception e) {
                    System.out.println("THAT BAI");
                }
            }
        }
        return coupon.getId();
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
    public long updateCoupon(Long id, CouponRequest couponRequest) { // sua phieu giam gia
        Coupon coupon = couponRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
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
        coupon.setCreatedBy(getUserById(couponRequest.getUserId()));
        coupon.setUpdatedBy(getUserById(couponRequest.getUserId()));
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


    private CouponResponse convertCouponResponse(Coupon coupon) {//lay du lieu phieu giam gia respone de hien thi danh sach
        return CouponResponse.builder().id(coupon.getId()).code(coupon.getCode()).name(coupon.getName()).type(coupon.getType()).discountType(coupon.getDiscountType()).discountValue(coupon.getDiscountValue()).maxValue(coupon.getMaxValue()).quantity(coupon.getQuantity()).conditions(coupon.getConditions()).startDate(coupon.getStartDate()).endDate(coupon.getEndDate()).status(coupon.getStatus()).description(coupon.getDescription()).imageUrl(convertToUrl(coupon.getCouponImage())).build();
    }

    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private String convertToUrl(CouponImage image) {
        return (image != null) ? image.getImageUrl() : null;
    }


}
