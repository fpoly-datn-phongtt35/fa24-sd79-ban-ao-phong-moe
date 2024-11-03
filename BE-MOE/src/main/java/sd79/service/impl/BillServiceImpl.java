package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.dto.requests.BillDetailRequest;
import sd79.dto.requests.BillRequest;
import sd79.dto.requests.common.BillParamFilter;
import sd79.dto.requests.common.CouponParamFilter;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.bills.BillCouponResponse;
import sd79.dto.response.bills.BillDetailResponse;
import sd79.dto.response.bills.BillResponse;
import sd79.dto.response.bills.ProductResponse;
import sd79.dto.response.productResponse.ProductDetailResponse2;
import sd79.exception.EntityNotFoundException;
import sd79.model.*;
import sd79.repositories.*;
import sd79.repositories.auth.UserRepository;
import sd79.repositories.customQuery.BillCustomizeQuery;
import sd79.repositories.products.ProductDetailRepository;
import sd79.repositories.products.ProductRepository;
import sd79.service.BillService;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
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
    public long storeBill(BillRequest billRequest) {
        long currentBillCount = billRepository.count() + 1;

        BillStatus billStatus = billStatusRepository.findById(billRequest.getBillStatus())
                .orElseThrow(() -> new IllegalArgumentException("BillStatus not found with ID: " + billRequest.getBillStatus()));

        Bill bill = Bill.builder()
                .code(generateRandomCode(currentBillCount))
                .customer(null)
                .coupon(null)
                .billStatus(billStatus)
                .shipping(null)
                .total(null)
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
    public long storePay(BillRequest billRequest, List<BillDetailRequest> billDetailRequests) {
        if (billRequest == null) {
            throw new IllegalArgumentException("BillRequest cannot be null");
        }

        // Find customer
        Customer customer = customerRepository.findById(billRequest.getCustomer())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + billRequest.getCustomer()));

        // Find coupon if present
        Coupon coupon = null;
        if (billRequest.getCoupon() != null) {
            coupon = couponRepository.findById(billRequest.getCoupon())
                    .orElseThrow(() -> new IllegalArgumentException("Coupon not found with ID: " + billRequest.getCoupon()));
        }

        // Find bill status
        BillStatus billStatus = billStatusRepository.findById(billRequest.getBillStatus())
                .orElseThrow(() -> new IllegalArgumentException("BillStatus not found with ID: " + billRequest.getBillStatus()));

        // Check for existing bill or create a new one
        Bill bill = billRepository.findByCode(billRequest.getCode())
                .orElse(Bill.builder()
                        .customer(customer)
                        .coupon(coupon)
                        .billStatus(billStatus)
                        .shipping(billRequest.getShippingCost() != null ? billRequest.getShippingCost() : BigDecimal.ZERO)
                        .total(billRequest.getTotalAmount() != null ? billRequest.getTotalAmount() : BigDecimal.ZERO)

                        .build());

        // Set or update bill attributes from billRequest
        bill.setUpdatedBy(getUserById(billRequest.getUserId()));
        bill.setShipping(billRequest.getShippingCost() != null ? billRequest.getShippingCost() : BigDecimal.ZERO);
        bill.setTotal(billRequest.getTotalAmount() != null ? billRequest.getTotalAmount() : BigDecimal.ZERO);
        bill.setBillStatus(billStatus);
        bill.setCreatedBy(bill.getCreatedBy() != null ? bill.getCreatedBy() : getUserById(billRequest.getUserId()));

        // Save the updated bill
        bill = billRepository.save(bill);

        BigDecimal totalBillAmount = BigDecimal.ZERO;

        // Process each BillDetailRequest
        for (BillDetailRequest detailRequest : billDetailRequests) {
            ProductDetail productDetail = productDetailRepository.findById(detailRequest.getProductDetail())
                    .orElseThrow(() -> new IllegalArgumentException("ProductDetail not found with ID: " + detailRequest.getProductDetail()));

            BillDetail billDetail = billDetailRepository.findByBillAndProductDetail(bill, productDetail)
                    .orElse(BillDetail.builder()
                            .productDetail(productDetail)
                            .bill(bill)
                            .createAt(new Date())
                            .build());

            int quantity = detailRequest.getQuantity();
            if (quantity > productDetail.getQuantity()) {
                throw new IllegalArgumentException("Not enough product quantity available. Available: " + productDetail.getQuantity());
            }

            // Update product quantity
//            productDetail.setQuantity(productDetail.getQuantity() - quantity);
//            productDetailRepository.save(productDetail);

            BigDecimal totalAmountProduct = detailRequest.getPrice()
                    .subtract(detailRequest.getDiscountAmount())
                    .multiply(new BigDecimal(quantity));

            // Set bill detail attributes
            billDetail.setQuantity(quantity);
            billDetail.setRetailPrice(detailRequest.getPrice());
            billDetail.setDiscountAmount(detailRequest.getDiscountAmount());
            billDetail.setTotalAmountProduct(totalAmountProduct);
            billDetail.setUpdateAt(new Date());

            billDetailRepository.save(billDetail);
            totalBillAmount = totalBillAmount.add(totalAmountProduct);
        }

        // Update the total amount of the bill if not set in billRequest
        if (billRequest.getTotalAmount() == null) {
            bill.setTotal(totalBillAmount);
        }

        // Save the final bill with updated total amount
        bill = billRepository.save(bill);

        if (bill.getId() == null) {
            throw new RuntimeException("Failed to save the bill to the database.");
        }

        return bill.getId();
    }

    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy user"));
    }

    private List<String> convertToUrl(List<ProductImage> images) {
        return images.stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
    }

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

    private BillResponse convertToBillResponse(Bill bill) {
        return BillResponse.builder()
                .id(bill.getId())
                .code(bill.getCode())
                .customer(bill.getCustomer())
                .coupon(convertToBillCouponResponse(bill.getCoupon()))
                .build();
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
