package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.dto.requests.BillDetailRequest;
import sd79.dto.requests.BillRequest;
import sd79.dto.response.bills.BillDetailRespone;
import sd79.dto.response.bills.BillRespone;
import sd79.dto.response.bills.ProductResponse;
import sd79.dto.response.productResponse.ProductDetailResponse2;
import sd79.exception.EntityNotFoundException;
import sd79.model.*;
import sd79.repositories.*;
import sd79.repositories.auth.UserRepository;
import sd79.repositories.products.ProductDetailRepository;
import sd79.service.BillService;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;
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

    //them lan 1
    @Override
    public List<BillRespone> getAllBills() {
        return this.billRepository.findAll().stream().map(this::convertToBillRespone).toList();
    }

    @Override
    public long storeBill(BillRequest billRequest) {
        long currentBillCount = billRepository.count() + 1;

        Bill bill = Bill.builder()
                .code(generateRandomCode(currentBillCount))
                .customer(null)
                .coupon(null)
                .billStatus(null)
                .shippingCost(null)
                .totalAmount(null)
                .barcode(null)
                .qrCode(null)
                .build();

        bill.setCreatedBy(getUserById(billRequest.getUserId()));
        bill.setUpdatedBy(getUserById(billRequest.getUserId()));
        bill = billRepository.save(bill);

        return bill.getId();
    }

    @Override
    public void deleteBill(long id) {
        this.billRepository.deleteById(id);
    }

    //them lan 2
    @Override
    public List<BillDetailRespone> getAllProducts(long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));
        List<BillDetail> billDetails = billDetailRepository.findByBill(bill);
        return billDetails.stream()
                .map(this::convertToBillRespone)
                .collect(Collectors.toList());
    }

    @Override
    public long storeProduct(BillDetailRequest billDetailRequest) {
        ProductDetail productDetail = productDetailRepository.findById(billDetailRequest.getProductDetail())
                .orElseThrow(() -> new IllegalArgumentException("ProductDetail not found with ID: " + billDetailRequest.getProductDetail()));
        Bill bill = billRepository.findById(billDetailRequest.getBill())
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billDetailRequest.getBill()));
        Optional<BillDetail> existingBillDetailOptional = billDetailRepository.findByProductDetailAndBill(productDetail, bill);

        BillDetail billDetail;
        BigDecimal retailPrice = billDetailRequest.getPrice();
        BigDecimal discountAmount = billDetailRequest.getDiscountAmount();
        int quantityToAdd = billDetailRequest.getQuantity();
        BigDecimal totalAmountProduct;

        if (existingBillDetailOptional.isPresent()) {
            billDetail = existingBillDetailOptional.get();
            int newQuantity = billDetail.getQuantity() + quantityToAdd;
            if (newQuantity > productDetail.getQuantity()) {
                throw new IllegalArgumentException("Not enough product quantity available. Available: " + productDetail.getQuantity());
            }

            billDetail.setQuantity(newQuantity);
            totalAmountProduct = retailPrice.subtract(discountAmount).multiply(new BigDecimal(newQuantity));
            billDetail.setTotalAmountProduct(totalAmountProduct);
            billDetail.setUpdateAt(new Date());
        } else {
            if (quantityToAdd > productDetail.getQuantity()) {
                throw new IllegalArgumentException("Not enough product quantity available. Available: " + productDetail.getQuantity());
            }

            totalAmountProduct = retailPrice.subtract(discountAmount).multiply(new BigDecimal(quantityToAdd));
            billDetail = BillDetail.builder()
                    .productDetail(productDetail)
                    .bill(bill)
                    .quantity(quantityToAdd)
                    .retailPrice(retailPrice)
                    .discountAmount(discountAmount)
                    .totalAmountProduct(totalAmountProduct)
                    .createAt(new Date())
                    .updateAt(new Date())
                    .build();
        }
        productDetail.setQuantity(productDetail.getQuantity() - quantityToAdd);
        productDetailRepository.save(productDetail);
        billDetail = billDetailRepository.save(billDetail);

        return billDetail.getId();
    }

    @Override
    public void deleteBillDetail(long billDetailId) {
        BillDetail billDetail = billDetailRepository.findById(billDetailId)
                .orElseThrow(() -> new IllegalArgumentException("BillDetail not found with ID: " + billDetailId));
        ProductDetail productDetail = billDetail.getProductDetail();
        productDetail.setQuantity(productDetail.getQuantity() + billDetail.getQuantity());
        productDetailRepository.save(productDetail); // Save the updated ProductDetail
        billDetailRepository.delete(billDetail);
    }

    //them lan 3

    @Override
    public long storeCustomer(Long billId, Long customerId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + customerId));
        bill.setCustomer(customer);
        bill.setUpdatedBy(getUserById(bill.getUpdatedBy().getId()));
        billRepository.save(bill);
        return bill.getId();
    }

    @Override
    public long deleteCustomer(long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));
        bill.setCustomer(null);
        bill.setUpdatedBy(getUserById(bill.getUpdatedBy().getId()));
        billRepository.save(bill);
        return bill.getId();
    }

    //them lan 4
    @Override
    public long storeCoupon(Long billId, Long couponId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found with ID: " + couponId));

        bill.setCoupon(coupon);
        bill.setUpdatedBy(getUserById(bill.getUpdatedBy().getId()));
        billRepository.save(bill);

        return bill.getId();
    }

    @Override
    public long deleteCoupon(long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));
        bill.setCoupon(null);
        bill.setUpdatedBy(getUserById(bill.getUpdatedBy().getId()));
        billRepository.save(bill);
        return bill.getId();
    }

    //them cuoi cung
    @Override
    public long storePay(BillRequest billRequest, List<BillDetailRequest> billDetailRequests) {
        Customer customer = customerRepository.findById(billRequest.getCustomer())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + billRequest.getCustomer()));
        Coupon coupon = null;

        if (billRequest.getCoupon() != null) {
            coupon = couponRepository.findById(billRequest.getCoupon())
                    .orElseThrow(() -> new IllegalArgumentException("Coupon not found with ID: " + billRequest.getCoupon()));
        }

        BillStatus billStatus = billRequest.getBillStatus() != null ?
                billStatusRepository.findById(billRequest.getBillStatus())
                        .orElseThrow(() -> new IllegalArgumentException("BillStatus not found with ID: " + billRequest.getBillStatus())) :
                billStatusRepository.findById(1)
                        .orElseThrow(() -> new IllegalArgumentException("Default BillStatus not found with ID: 1"));

        Bill bill = billRepository.findByCode(billRequest.getCode())
                .orElse(Bill.builder()
                        .customer(customer)
                        .coupon(coupon)
                        .billStatus(billStatus)
                        .shippingCost(billRequest.getShippingCost())
                        .totalAmount(billRequest.getTotalAmount())
                        .barcode(billRequest.getBarcode())
                        .qrCode(billRequest.getQrCode())
                        .build());

        bill.setCreatedBy(getUserById(billRequest.getUserId()));
        bill.setUpdatedBy(getUserById(billRequest.getUserId()));
        bill.setShippingCost(billRequest.getShippingCost());
        bill.setTotalAmount(billRequest.getTotalAmount());
        bill.setBarcode(billRequest.getBarcode());
        bill.setQrCode(billRequest.getQrCode());
        bill.setBillStatus(billStatus);
        bill = billRepository.save(bill);

        for (BillDetailRequest detailRequest : billDetailRequests) {
            ProductDetail productDetail = productDetailRepository.findById(detailRequest.getProductDetail())
                    .orElseThrow(() -> new IllegalArgumentException("ProductDetail not found with ID: " + detailRequest.getProductDetail()));

            BillDetail billDetail = billDetailRepository.findByBillAndProductDetail(bill, productDetail)
                    .orElse(BillDetail.builder()
                            .productDetail(productDetail)
                            .bill(bill)
                            .createAt(new Date())
                            .build());

            billDetail.setQuantity(detailRequest.getQuantity());
            billDetail.setRetailPrice(detailRequest.getPrice());
            billDetail.setDiscountAmount(detailRequest.getDiscountAmount());
//            billDetail.setTotalAmountProduct(detailRequest.getTotalAmountProduct());
            billDetail.setUpdateAt(new Date());

            billDetailRepository.save(billDetail);
        }

        return bill.getId();
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

    private ProductResponse convertToProductResponse(ProductDetail productDetail) {
        return ProductResponse.builder()
                .id(productDetail.getId())
                .productName(String.format("%s [%s - %s]",
                        productDetail.getProduct().getName(),
                        productDetail.getColor().getName(),
                        productDetail.getSize().getName()))
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

    private BillRespone convertToBillRespone(Bill bill) {
       return BillRespone.builder()
               .id(bill.getId())
               .code(bill.getCode())
               .customer(bill.getCustomer())
               .coupon(bill.getCoupon())
               .build();
    }

    private BillDetailRespone convertToBillRespone(BillDetail billDetail) {
        ProductDetailResponse2 productDetailResponse = ProductDetailResponse2.builder()
                .id(billDetail.getProductDetail().getId())
                .productName(String.format("%s [%s - %s]",
                        billDetail.getProductDetail().getProduct().getName(),
                        billDetail.getProductDetail().getColor().getName(),
                        billDetail.getProductDetail().getSize().getName()))
                .imageUrl(convertToUrl(billDetail.getProductDetail().getProduct().getProductImages()))
                .brand(billDetail.getProductDetail().getProduct().getBrand().getName())
                .category(billDetail.getProductDetail().getProduct().getCategory().getName())
                .material(billDetail.getProductDetail().getProduct().getMaterial().getName())
                .color(billDetail.getProductDetail().getColor().getName())
                .size(billDetail.getProductDetail().getSize().getName())
                .origin(billDetail.getProductDetail().getProduct().getOrigin())
                .price(billDetail.getProductDetail().getRetailPrice())
                .quantity(billDetail.getProductDetail().getQuantity())
                .build();

        return BillDetailRespone.builder()
                .id(billDetail.getId())
                .productDetail(productDetailResponse)
                .quantity(billDetail.getQuantity())
                .retailPrice(billDetail.getRetailPrice())
                .discountAmount(billDetail.getDiscountAmount())
                .build();
    }

    private String generateRandomCode(long currentId) {
        long totalCodes = 26 * 26 * 100000000;
        long index = currentId - 1;
        char letter1 = (char) ('A' + (index / (100000000)));
        char letter2 = (char) ('A' + (index % (100000000) / 10000000));
        long numberPart = index % 100000000 + 1;
        String formattedNumber = String.format("%08d", numberPart);
        return "" + letter1 + letter2 + formattedNumber;
    }

}
