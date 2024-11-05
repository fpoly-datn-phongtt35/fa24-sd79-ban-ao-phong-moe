package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.dto.requests.BillDetailRequest;
import sd79.dto.requests.BillRequest;
import sd79.dto.response.CouponResponse;
import sd79.dto.response.bills.BillCouponResponse;
import sd79.dto.response.bills.BillDetailResponse;
import sd79.dto.response.bills.BillResponse;
import sd79.dto.response.productResponse.ProductDetailResponse2;
import sd79.exception.EntityNotFoundException;
import sd79.model.*;
import sd79.repositories.*;
import sd79.repositories.auth.UserRepository;
import sd79.repositories.customQuery.BillCustomizeQuery;
import sd79.repositories.products.ProductDetailRepository;
import sd79.service.BillService;

import java.math.BigDecimal;
import java.util.*;
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
    private final BillRepo billRepo;

    //them lan 1
    @Override
    public List<BillResponse> getAllBills() {
        return this.billRepository.findAll().stream().map(this::convertToBillResponse).toList();
    }

    @Override
    public List<BillResponse> getAllBill() { // get bill hien tai
        return this.billCustomizeQuery.getAllBills();
    }

    @Override
    public BillResponse getBillId(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with id " + id));
        return convertToBillDetail(bill);
    }

    @Override
    public long storeBill(BillRequest billRequest) {
        long currentBillCount = billRepository.count() + 1;

//        BillStatus billStatus = billStatusRepository.findById(billRequest.getBillStatus())
//                .orElseThrow(() -> new IllegalArgumentException("BillStatus not found with ID: " + billRequest.getBillStatus()));

        Bill bill = Bill.builder()
                .code(generateRandomCode(currentBillCount))
                .billStatus(null)
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
    public List<BillDetailResponse> getAllProducts(long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));
        List<BillDetail> billDetails = billDetailRepository.findByBill(bill);
        return billDetails.stream()
                .map(this::convertToBillResponse)
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
    public List<Customer> getAllCustomers(long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));
        Customer customer = bill.getCustomer();
        return customer != null ? List.of(customer) : List.of();
    }

    @Override
    public long storeCustomer(Long billId, Long customerId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));
        if (customerId == null || customerId == 0) {
            bill.setCustomer(null);
        } else {
            Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + customerId));
            bill.setCustomer(customer);
        }

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
    public List<BillCouponResponse> getAllCoupons(long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));

        Coupon coupon = bill.getCoupon();
        if (coupon != null) {
            return List.of(convertToBillCoupon(coupon));
        }
        return Collections.emptyList();
    }

    @Override
    public long storeCoupon(Long billId, Long couponId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found with ID: " + couponId));
        if (coupon.getQuantity() != null && coupon.getQuantity() <= 0) {
            throw new IllegalArgumentException("Coupon is no longer available (quantity depleted).");
        }
        bill.setCoupon(coupon);
        if (coupon.getQuantity() != null) {
            coupon.setQuantity(coupon.getQuantity() - 1);
        }
        coupon.setUsageCount((coupon.getUsageCount() != null ? coupon.getUsageCount() : 0) + 1);
        bill.setUpdatedBy(getUserById(bill.getUpdatedBy().getId()));
        couponRepository.save(coupon);
        billRepository.save(bill);

        return bill.getId();
    }

    @Override
    public long deleteCoupon(long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billId));

        Coupon coupon = bill.getCoupon();
        if (coupon != null) {
            coupon.setQuantity(coupon.getQuantity() + 1);
            coupon.setUsageCount((coupon.getUsageCount() != null && coupon.getUsageCount() > 0)
                    ? coupon.getUsageCount() - 1
                    : 0);
            couponRepository.save(coupon);
        }

        bill.setCoupon(null);
        bill.setUpdatedBy(getUserById(bill.getUpdatedBy().getId()));
        billRepository.save(bill);

        return bill.getId();
    }

    //them cuoi cung
    public long storePay(BillRequest billRequest, List<BillDetailRequest> billDetailRequests) {
        validateBillRequest(billRequest);

        Customer customer = findCustomer(billRequest.getCustomer());
        Coupon coupon = findCoupon(billRequest.getCoupon());
        BillStatus billStatus = findBillStatus(billRequest.getBillStatus());

        Bill bill = getOrCreateBill(billRequest, customer, coupon, billStatus);
        updateBillAttributes(bill, billRequest, billStatus);

        BigDecimal totalBillAmount = processBillDetails(bill, billDetailRequests);

        if (billRequest.getTotal() == null) {
            bill.setTotal(totalBillAmount);
        }

        bill = saveBill(bill);

        if (bill.getId() == null) {
            throw new RuntimeException("Failed to save the bill to the database.");
        }

        return bill.getId();
    }

    private void validateBillRequest(BillRequest billRequest) {
        if (billRequest == null) {
            throw new IllegalArgumentException("BillRequest cannot be null");
        }
    }

    private Customer findCustomer(Long customerId) {
        if (customerId != null) {
            return customerRepository.findById(customerId).orElse(null);
        }
        return null;
    }

    private Coupon findCoupon(Long couponId) {
        if (couponId != null) {
            return couponRepository.findById(couponId)
                    .orElseThrow(() -> new IllegalArgumentException("Coupon not found with ID: " + couponId));
        }
        return null;
    }

    private BillStatus findBillStatus(Integer billStatusId) {
        return billStatusRepository.findById(billStatusId)
                .orElseThrow(() -> new IllegalArgumentException("BillStatus not found with ID: " + billStatusId));
    }

    private Bill getOrCreateBill(BillRequest billRequest, Customer customer, Coupon coupon, BillStatus billStatus) {
        return billRepository.findByCode(billRequest.getCode())
                .orElse(Bill.builder()
                        .bankCode(billRequest.getBankCode() != null ? billRequest.getBankCode() : "")
                        .customer(customer)
                        .coupon(coupon)
                        .billStatus(billStatus)
                        .shipping(billRequest.getShipping() != null ? billRequest.getShipping() : BigDecimal.ZERO)
                        .subtotal(billRequest.getSubtotal() != null ? billRequest.getSubtotal() : BigDecimal.ZERO)
                        .sellerDiscount(billRequest.getSellerDiscount() != null ? billRequest.getSellerDiscount() : BigDecimal.ZERO)
                        .total(billRequest.getTotal() != null ? billRequest.getTotal() : BigDecimal.ZERO)
                        .paymentMethod(billRequest.getPaymentMethod())
                        .message(billRequest.getMessage())
                        .note(billRequest.getNote())
                        .paymentTime(billRequest.getPaymentTime())
                        .build());
    }

    private void updateBillAttributes(Bill bill, BillRequest billRequest, BillStatus billStatus) {
        bill.setBankCode(billRequest.getBankCode() != null ? billRequest.getBankCode() : "");
        bill.setShipping(billRequest.getShipping() != null ? billRequest.getShipping() : BigDecimal.ZERO);
        bill.setSubtotal(billRequest.getSubtotal() != null ? billRequest.getSubtotal() : BigDecimal.ZERO);
        bill.setSellerDiscount(billRequest.getSellerDiscount() != null ? billRequest.getSellerDiscount() : BigDecimal.ZERO);
        bill.setTotal(billRequest.getTotal() != null ? billRequest.getTotal() : BigDecimal.ZERO);
        bill.setPaymentMethod(billRequest.getPaymentMethod());
        bill.setMessage(billRequest.getMessage());
        bill.setNote(billRequest.getNote());
        bill.setPaymentTime(billRequest.getPaymentTime());
        bill.setBillStatus(billStatus);
        bill.setUpdatedBy(getUserById(billRequest.getUserId()));
        bill.setCreatedBy(bill.getCreatedBy() != null ? bill.getCreatedBy() : getUserById(billRequest.getUserId()));
    }

    private BigDecimal processBillDetails(Bill bill, List<BillDetailRequest> billDetailRequests) {
        BigDecimal totalBillAmount = BigDecimal.ZERO;

        for (BillDetailRequest detailRequest : billDetailRequests) {
            ProductDetail productDetail = findProductDetail(detailRequest.getProductDetail());

            BillDetail billDetail = getOrCreateBillDetail(bill, productDetail);

            updateBillDetail(billDetail, detailRequest, productDetail);

            BigDecimal totalAmountProduct = calculateTotalAmountProduct(detailRequest);
            totalBillAmount = totalBillAmount.add(totalAmountProduct);
        }

        return totalBillAmount;
    }

    private ProductDetail findProductDetail(Long productDetailId) {
        return productDetailRepository.findById(productDetailId)
                .orElseThrow(() -> new IllegalArgumentException("ProductDetail not found with ID: " + productDetailId));
    }

    private BillDetail getOrCreateBillDetail(Bill bill, ProductDetail productDetail) {
        return billDetailRepository.findByBillAndProductDetail(bill, productDetail)
                .orElse(BillDetail.builder()
                        .productDetail(productDetail)
                        .bill(bill)
                        .createAt(new Date())
                        .build());
    }

    private void updateBillDetail(BillDetail billDetail, BillDetailRequest detailRequest, ProductDetail productDetail) {
        int quantity = detailRequest.getQuantity();
        if (quantity > productDetail.getQuantity()) {
            throw new IllegalArgumentException("Not enough product quantity available. Available: " + productDetail.getQuantity());
        }

        BigDecimal totalAmountProduct = calculateTotalAmountProduct(detailRequest);

        billDetail.setQuantity(quantity);
        billDetail.setRetailPrice(detailRequest.getPrice());
        billDetail.setDiscountAmount(detailRequest.getDiscountAmount());
        billDetail.setTotalAmountProduct(totalAmountProduct);
        billDetail.setUpdateAt(new Date());

        billDetailRepository.save(billDetail);
    }

    private BigDecimal calculateTotalAmountProduct(BillDetailRequest detailRequest) {
        return detailRequest.getPrice()
                .subtract(detailRequest.getDiscountAmount())
                .multiply(new BigDecimal(detailRequest.getQuantity()));
    }

    private Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }

    //thanh toan

    //----

    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy user"));
    }

    private List<String> convertToUrl(List<ProductImage> images) {
        return images.stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
    }

    //Modal bill coupon
    private BillCouponResponse convertToBillCouponResponse(Coupon coupon) {
        if (coupon == null) return null;

        return BillCouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .discountValue(coupon.getDiscountValue())
                .discountType(coupon.getDiscountType())
                .conditions(coupon.getConditions())
                .maxValue(coupon.getMaxValue())
                .build();
    }

    //Get bill
    private BillResponse convertToBillResponse(Bill bill) {
        return BillResponse.builder()
                .id(bill.getId())
                .code(bill.getCode())
                .customer(bill.getCustomer())
                .coupon(convertToBillCouponResponse(bill.getCoupon()))
                .build();
    }

    //Detail bill
    private BillResponse convertToBillDetail(Bill bill) {
        BillResponse.BillResponseBuilder billResponseBuilder = BillResponse.builder();
        billResponseBuilder
                .id(bill.getId())
                .code(bill.getCode())
                .customer(bill.getCustomer())
                .coupon(convertToBillCouponResponse(bill.getCoupon()))
                .billDetails(bill.getBillDetails().stream()
                        .map(this::convertToBillResponse)
                        .collect(Collectors.toList())
                );

        billResponseBuilder.billStatus(bill.getBillStatus().getId());

        return billResponseBuilder.build();
    }

    private BillCouponResponse convertToBillCoupon(Coupon coupon) {
        return BillCouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .discountValue(coupon.getDiscountValue())
                .discountType(coupon.getDiscountType())
                .conditions(coupon.getConditions())
                .maxValue(coupon.getMaxValue())
                .build();
    }

    //Modal product bill
    private BillDetailResponse convertToBillResponse(BillDetail billDetail) {
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

        return BillDetailResponse.builder()
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
