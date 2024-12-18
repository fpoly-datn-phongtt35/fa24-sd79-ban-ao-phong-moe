package sd79.service.impl;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.billRequest.BillCustomerRequest;
import sd79.dto.requests.billRequest.BillDetailRequest;
import sd79.dto.requests.billRequest.BillRequest;
import sd79.dto.requests.productRequests.CustomerRequest;
import sd79.dto.response.bills.BillCouponResponse;
import sd79.dto.response.bills.BillDetailResponse;
import sd79.dto.response.bills.BillResponse;
import sd79.dto.response.productResponse.ProductDetailResponse2;
import sd79.exception.EntityNotFoundException;
import sd79.exception.InvalidDataException;
import sd79.model.*;
import sd79.repositories.*;
import sd79.repositories.auth.UserRepository;
import sd79.repositories.customQuery.BillCustomizeQuery;
import sd79.repositories.products.ProductDetailRepository;
import sd79.service.BillService;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
    private final CustomerAddressRepository customerAddressRepository;

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

        BillStatus billStatus = billStatusRepository.findById(billRequest.getBillStatus())
                .orElseThrow(() -> new IllegalArgumentException("BillStatus not found with ID: " + billRequest.getBillStatus()));

        Bill bill = Bill.builder()
                .code(generateRandomCode(currentBillCount))
                .billStatus(billStatus)
                .build();

        bill.setCreatedBy(getUserById(billRequest.getUserId()));
        bill.setUpdatedBy(getUserById(billRequest.getUserId()));
        bill = billRepository.save(bill);

        return bill.getId();
    }

    @Override
    public void deleteBill(long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + id));

        // Trả lại số lượng sản phẩm trong các BillDetail
        List<BillDetail> billDetails = billDetailRepository.findByBill(bill);
        for (BillDetail billDetail : billDetails) {
            ProductDetail productDetail = billDetail.getProductDetail();
            productDetail.setQuantity(productDetail.getQuantity() + billDetail.getQuantity());
            productDetailRepository.save(productDetail);

            // Xóa BillDetail sau khi trả lại số lượng
            billDetailRepository.delete(billDetail);
        }

        Coupon coupon = bill.getCoupon();
        if (coupon != null) {
            coupon.setQuantity(coupon.getQuantity() + 1);
            coupon.setUsageCount((coupon.getUsageCount() != null && coupon.getUsageCount() > 0)
                    ? coupon.getUsageCount() - 1
                    : 0);
            couponRepository.save(coupon);
        }

        // Xóa hóa đơn
        billRepository.deleteById(id);
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
        int requestedQuantity = billDetailRequest.getQuantity() != null ? billDetailRequest.getQuantity() : 1;

        ProductDetail productDetail = productDetailRepository.findById(billDetailRequest.getProductDetail())
                .orElseThrow(() -> new IllegalArgumentException("ProductDetail not found with ID: " + billDetailRequest.getProductDetail()));
        Bill bill = billRepository.findById(billDetailRequest.getBill())
                .orElseThrow(() -> new IllegalArgumentException("Bill not found with ID: " + billDetailRequest.getBill()));
        Optional<BillDetail> existingBillDetailOptional = billDetailRepository.findByProductDetailAndBill(productDetail, bill);

        BillDetail billDetail;
        BigDecimal retailPrice = billDetailRequest.getPrice();
        BigDecimal discountAmount = billDetailRequest.getDiscountAmount();
        BigDecimal totalAmountProduct;

        if (existingBillDetailOptional.isPresent()) {
            billDetail = existingBillDetailOptional.get();

            int currentQuantity = billDetail.getQuantity();
            int quantityDifference = requestedQuantity - currentQuantity;

            if (quantityDifference > productDetail.getQuantity()) {
                throw new IllegalArgumentException("Not enough product quantity available. Available: " + productDetail.getQuantity());
            }

            billDetail.setQuantity(requestedQuantity);
            totalAmountProduct = discountAmount.multiply(new BigDecimal(requestedQuantity));
            billDetail.setTotalAmountProduct(totalAmountProduct);
            billDetail.setUpdateAt(new Date());

            productDetail.setQuantity(productDetail.getQuantity() - quantityDifference);
        } else {
            if (requestedQuantity > productDetail.getQuantity()) {
                throw new IllegalArgumentException("Not enough product quantity available. Available: " + productDetail.getQuantity());
            }

            totalAmountProduct = discountAmount.multiply(new BigDecimal(requestedQuantity));
            billDetail = BillDetail.builder()
                    .productDetail(productDetail)
                    .bill(bill)
                    .quantity(requestedQuantity)
                    .retailPrice(retailPrice)
                    .discountAmount(discountAmount)
                    .totalAmountProduct(totalAmountProduct)
                    .createAt(new Date())
                    .updateAt(new Date())
                    .build();

            productDetail.setQuantity(productDetail.getQuantity() - requestedQuantity);
        }

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
        productDetailRepository.save(productDetail);
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

    @Transactional
    @Override
    public long updateCustomer(Long id, BillCustomerRequest billCustomerRequest) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        CustomerAddress customerAddress = customer.getCustomerAddress();
        if (customerAddress == null) {
            customerAddress = new CustomerAddress();
        }
        User user = customer.getUser();

        if (this.customerRepository.existsByPhoneNumber(billCustomerRequest.getPhoneNumber()) &&
                !customer.getPhoneNumber().equals(billCustomerRequest.getPhoneNumber())) {
            throw new EntityExistsException("Số điện thoại đã tồn tại.");
        }
        if (user == null) {
            user = new User();
        }
        customerAddress.setCity(billCustomerRequest.getCity());
        customerAddress.setCityId(billCustomerRequest.getCity_id());
        customerAddress.setDistrict(billCustomerRequest.getDistrict());
        customerAddress.setDistrictId(billCustomerRequest.getDistrict_id());
        customerAddress.setWard(billCustomerRequest.getWard());
        customerAddress.setStreetName(billCustomerRequest.getStreetName());
        customerAddress = customerAddressRepository.save(customerAddress);
        user = userRepository.save(user);
        customer.setCustomerAddress(customerAddress);
        customer.setUser(user);
        populateCustomerData(customer, billCustomerRequest);
        return customerRepository.save(customer).getId();
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

        // Remove existing coupon if there is one, regardless of the new coupon's ID
        Coupon currentCoupon = bill.getCoupon();
        if (currentCoupon != null) {
            currentCoupon.setQuantity(currentCoupon.getQuantity() + 1);
            currentCoupon.setUsageCount((currentCoupon.getUsageCount() != null && currentCoupon.getUsageCount() > 0)
                    ? currentCoupon.getUsageCount() - 1
                    : 0);
            couponRepository.save(currentCoupon);
        }

        // If the new coupon ID is null or 0, set the coupon on the bill to null and save
        if (couponId == null || couponId == 0) {
            bill.setCoupon(null);
            bill.setUpdatedBy(getUserById(bill.getUpdatedBy().getId()));
            billRepository.save(bill);
            return bill.getId();
        }

        // Retrieve and validate the new coupon
        Coupon newCoupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found with ID: " + couponId));

        if (newCoupon.getQuantity() != null && newCoupon.getQuantity() <= 0) {
            throw new IllegalArgumentException("Coupon is no longer available (quantity depleted).");
        }

        // Update the new coupon's quantity and usage count
        if (newCoupon.getQuantity() != null) {
            newCoupon.setQuantity(newCoupon.getQuantity() - 1);
        }
        newCoupon.setUsageCount((newCoupon.getUsageCount() != null ? newCoupon.getUsageCount() : 0) + 1);

        // Set the new coupon to the bill and save
        bill.setCoupon(newCoupon);
//        bill.setUpdatedBy(getUserById(bill.getUpdatedBy().getId()));

        couponRepository.save(newCoupon);
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
//        bill.setUpdatedBy(getUserById(bill.getUpdatedBy().getId()));
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

        // Accumulate total bill amount across all products
        BigDecimal totalBillAmount = processBillDetails(bill, billDetailRequests);

        // Set the total on bill if it's null, or update with the accumulated total
        bill.setTotal(billRequest.getTotal() != null ? billRequest.getTotal() : totalBillAmount);

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

            BigDecimal totalAmountProduct = calculateTotalAmountProduct(detailRequest);

            // Update the accumulated total
            totalBillAmount = totalBillAmount.add(totalAmountProduct);

            // Update and save the bill detail
            updateBillDetail(billDetail, detailRequest, totalAmountProduct);
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

    private void updateBillDetail(BillDetail billDetail, BillDetailRequest detailRequest, BigDecimal totalAmountProduct) {
        int quantity = detailRequest.getQuantity();
        ProductDetail productDetail = billDetail.getProductDetail();

        int totalQuantity =  productDetail.getQuantity() + quantity;

        if(totalQuantity < quantity) {
            throw new InvalidDataException("Không đủ số lượng sản phẩm: " + productDetail.getQuantity());
        }

        billDetail.setQuantity(quantity);
        billDetail.setRetailPrice(detailRequest.getPrice());
        billDetail.setDiscountAmount(detailRequest.getDiscountAmount());

        // Ensure totalAmountProduct is correctly set
        if (totalAmountProduct != null) {
            billDetail.setTotalAmountProduct(totalAmountProduct);
        } else {
            throw new IllegalArgumentException("Total amount for the product cannot be null.");
        }

        billDetail.setUpdateAt(new Date());

        billDetailRepository.save(billDetail);
    }

    public void calculateTotalAmounts(List<BillDetailRequest> detailRequests) {
        if (detailRequests == null || detailRequests.isEmpty()) {
            throw new IllegalArgumentException("The list of BillDetailRequests cannot be null or empty.");
        }

        // Iterate through the list of BillDetailRequest objects
        for (BillDetailRequest detailRequest : detailRequests) {
            BigDecimal totalAmountProduct = calculateTotalAmountProduct(detailRequest);

            // Set the calculated total amount to the corresponding BillDetailRequest
            detailRequest.setTotalAmountProduct(totalAmountProduct);

            // Log the calculated total amount for tracking purposes
            System.out.println("Calculated totalAmountProduct for product_detail_id " + detailRequest.getProductDetail() + ": " + totalAmountProduct);
        }
    }
    private BigDecimal calculateTotalAmountProduct(BillDetailRequest detailRequest) {
        if (detailRequest == null) {
            throw new IllegalArgumentException("BillDetailRequest cannot be null.");
        }

        BigDecimal price = detailRequest.getPrice();
        BigDecimal discount = detailRequest.getDiscountAmount();
        int quantity = detailRequest.getQuantity();

        // Validation to ensure price and discount are not null
        if (price == null || discount == null) {
            throw new IllegalArgumentException("Price and discount cannot be null.");
        }

        // Return the total amount for the product, factoring in price, discount, and quantity
        return price.subtract(discount).multiply(new BigDecimal(quantity));
    }

    private Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }

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
        BigDecimal retailPrice = billDetail.getRetailPrice();
        BigDecimal discountAmount = billDetail.getDiscountAmount();
        BigDecimal sellPrice = retailPrice.subtract(discountAmount != null ? discountAmount : BigDecimal.ZERO);

        Integer percent = null;
        if (discountAmount != null && retailPrice.compareTo(BigDecimal.ZERO) > 0) {
            percent = discountAmount.multiply(BigDecimal.valueOf(100))
                    .divide(retailPrice, 2, RoundingMode.HALF_UP)
                    .intValue();
        }

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
                .price(retailPrice)
                .sellPrice(sellPrice)
                .percent(percent)
                .quantity(billDetail.getProductDetail().getQuantity())
                .build();

        return BillDetailResponse.builder()
                .id(billDetail.getId())
                .productDetail(productDetailResponse)
                .quantity(billDetail.getQuantity())
                .retailPrice(retailPrice)
                .discountAmount(discountAmount)
                .build();
    }

    //customer
    private void populateCustomerData(Customer customer, BillCustomerRequest billCustomerRequest) {
        customer.setFirstName(billCustomerRequest.getFirstName());
        customer.setLastName(billCustomerRequest.getLastName());
        customer.setPhoneNumber(billCustomerRequest.getPhoneNumber());
        customer.setUpdatedAt(new Date());
    }

    private String generateRandomCode(long currentId) {
        Random random = new Random();
        int number = random.nextInt(100000000);
        return String.format("HD%08d", number);
    }

}
