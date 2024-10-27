package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sd79.dto.requests.BillDetailRequest;
import sd79.dto.requests.BillRequest;
import sd79.dto.requests.common.BillParamFilter;
import sd79.dto.requests.common.ProductParamFilter;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.bills.ProductResponse;
import sd79.exception.EntityNotFoundException;
import sd79.model.*;
import sd79.repositories.*;
import sd79.repositories.auth.UserRepository;
import sd79.repositories.customQuery.BillCustomizeQuery;
import sd79.repositories.products.ProductDetailRepository;
import sd79.service.BillService;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class BillServiceImpl implements BillService {
    private final BillRepo billRepository;
    private final BillDetailRepo billDetailRepository;
    private final CustomerRepository customerRepository;
    private final CouponRepo couponRepository;
    private final ProductDetailRepository productDetailRepository;
    private final BillStatusRepo billStatusRepository;
    private final UserRepository userRepository;
    private final BillCustomizeQuery billCustomizeQuery;


    @Override
    public long storeBill(BillRequest billRequest, List<BillDetailRequest> billDetailRequests) {
        Customer customer = customerRepository.findById(billRequest.getCustomer())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + billRequest.getCustomer()));
        Coupon coupon = null;
        if (billRequest.getCoupon() != null) {
            coupon = couponRepository.findById(billRequest.getCoupon())
                    .orElseThrow(() -> new IllegalArgumentException("Coupon not found with ID: " + billRequest.getCoupon()));
        }
        BillStatus billStatus = billStatusRepository.findById(billRequest.getBillStatus())
                .orElseThrow(() -> new IllegalArgumentException("BillStatus not found with ID: " + billRequest.getBillStatus()));
        Bill bill = Bill.builder()
                .code(billRequest.getCode())
                .customer(customer)
                .coupon(coupon)
                .billStatus(billStatus)
                .shippingCost(billRequest.getShippingCost())
                .totalAmount(billRequest.getTotalAmount())
                .barcode(billRequest.getBarcode())
                .qrCode(billRequest.getQrCode())
                .build();
        bill.setCreatedBy(getUserById(billRequest.getUserId()));
        bill.setUpdatedBy(getUserById(billRequest.getUserId()));
        bill = billRepository.save(bill);
        for (BillDetailRequest detailRequest : billDetailRequests) {
            ProductDetail productDetail = productDetailRepository.findById(detailRequest.getProductDetail())
                    .orElseThrow(() -> new IllegalArgumentException("ProductDetail not found with ID: " + detailRequest.getProductDetail()));
            BillDetail billDetail = BillDetail.builder()
                    .productDetail(productDetail)
                    .bill(bill)
                    .quantity(detailRequest.getQuantity())
                    .retailPrice(detailRequest.getRetailPrice())
                    .discountAmount(detailRequest.getDiscountAmount())
                    .totalAmountProduct(detailRequest.getTotalAmountProduct())
                    .createAt(new Date())
                    .updateAt(new Date())
                    .build();
            billDetailRepository.save(billDetail);
        }
        return bill.getId();
    }

    @Override
    public PageableResponse getAllBillProducts(BillParamFilter param) {
        if (param.getPageNo() < 1) {
            param.setPageNo(1);
        }
        return this.billCustomizeQuery.getAllBillProducts(param);
    }



    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy user"));
    }

    private ProductResponse convertToBillProductResponse(ProductDetail productDetail) {
        return ProductResponse.builder()
                .id(productDetail.getId())
                .productName(String.format("%s [%s - %s]", productDetail.getProduct().getName(), productDetail.getColor().getName(),  productDetail.getSize().getName()))
                .imageUrl(convertToUrl(productDetail.getProduct().getProductImages()))
                .brand(productDetail.getProduct().getBrand().getName())
                .category(productDetail.getProduct().getCategory().getName())
                .material(productDetail.getProduct().getMaterial().getName())
                .color(productDetail.getColor().getName())
                .size(productDetail.getSize().getName())
                .origin(productDetail.getProduct().getOrigin())
                .price(productDetail.getRetailPrice())
                .quantity(productDetail.getQuantity())
                .build();
    }

    private List<String> convertToUrl(List<ProductImage> images) {
        return images.stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
    }
}
