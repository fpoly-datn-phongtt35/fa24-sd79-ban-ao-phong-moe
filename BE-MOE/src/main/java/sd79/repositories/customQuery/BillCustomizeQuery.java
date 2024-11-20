package sd79.repositories.customQuery;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import sd79.dto.requests.common.BillEditParamFilter;
import sd79.dto.requests.common.BillListParamFilter;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.bills.*;
import sd79.dto.response.clients.invoices.InvoiceResponse;
import sd79.dto.response.productResponse.ProductDetailResponse2;
import sd79.enums.ProductStatus;
import sd79.exception.InvalidDataException;
import sd79.model.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BillCustomizeQuery {

    private static final String LIKE_FORMAT = "%%%s%%";

    @PersistenceContext
    private EntityManager entityManager;

    public List<BillResponse> getAllBills() {
        String sql = "SELECT b FROM Bill b WHERE b.billStatus.status = 'PENDING'";
        TypedQuery<Bill> query = entityManager.createQuery(sql, Bill.class);
        List<Bill> bills = query.getResultList();
        return bills.stream().map(this::convertToBillResponse).collect(Collectors.toList());
    }

    private BillResponse convertToBillResponse(Bill bill) {
        return BillResponse.builder()
                .id(bill.getId())
                .code(bill.getCode())
                .customer(bill.getCustomer())
                .coupon(bill.getCoupon() != null ? convertToBillCouponResponse(bill.getCoupon()) : null)
                .build();
    }

    private BillCouponResponse convertToBillCouponResponse(Coupon coupon) {
        return BillCouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .discountValue(coupon.getDiscountValue())
                .discountType(coupon.getDiscountType())
                .maxValue(coupon.getMaxValue())
                .conditions(coupon.getConditions())
                .build();
    }

    public PageableResponse getAllBillList(BillListParamFilter param) {
        List<Integer> allowedStatusIds = List.of(1, 2, 4, 7, 8);

        // Constructing the SQL query for filtering bills based on status, keyword, and deletion status
        StringBuilder sql = new StringBuilder("SELECT b FROM Bill b WHERE b.isDeleted = false"); // Ensure bills are not marked as deleted

        if (StringUtils.hasLength(param.getKeyword())) {
            sql.append(" AND lower(b.code) like lower(:keyword)");
        }

        // Default status to 2 if none is provided
        Integer status = param.getStatus() != null ? param.getStatus() : 2;

        if (allowedStatusIds.contains(status)) {
            sql.append(" AND b.billStatus.id = :statusId");

            // Sorting based on status
            if (status == 2) {
                sql.append(" ORDER BY b.createAt ASC"); // Oldest first for status 2
            } else if (status == 8) {
                sql.append(" ORDER BY b.createAt DESC"); // Newest first for status 8
            } else {
                sql.append(" ORDER BY b.createAt DESC"); // Default sorting for other statuses (including status 1)
            }
        } else {
            throw new InvalidDataException("Status ID is invalid");
        }

        TypedQuery<Bill> query = entityManager.createQuery(sql.toString(), Bill.class);

        if (StringUtils.hasLength(param.getKeyword())) {
            query.setParameter("keyword", "%" + param.getKeyword().trim().toLowerCase() + "%");
        }
        query.setParameter("statusId", status);

        query.setFirstResult((param.getPageNo() - 1) * param.getPageSize());
        query.setMaxResults(param.getPageSize());

        List<BillListResponse> billResponses = query.getResultList().stream().map(bill -> BillListResponse.builder()
                .id(bill.getId())
                .code(bill.getCode())
                .customer(bill.getCustomer())
                .total(bill.getTotal())
                .billStatus(bill.getBillStatus().getId())
                .createAt(bill.getCreateAt())
                .build()).toList();

        // Count query to get total number of records (also ensuring isDelete = 0)
        StringBuilder countPage = new StringBuilder("SELECT count(b) FROM Bill b WHERE b.isDeleted = false"); // Ensure bills are not marked as deleted

        if (StringUtils.hasLength(param.getKeyword())) {
            countPage.append(" AND lower(b.code) like lower(:keyword)");
        }
        countPage.append(" AND b.billStatus.id = :statusId");

        TypedQuery<Long> countQuery = entityManager.createQuery(countPage.toString(), Long.class);

        if (StringUtils.hasLength(param.getKeyword())) {
            countQuery.setParameter("keyword", "%" + param.getKeyword().trim().toLowerCase() + "%");
        }
        countQuery.setParameter("statusId", status);

        Long totalElements = countQuery.getSingleResult();

        // Creating the pageable response
        Pageable pageable = PageRequest.of(param.getPageNo() - 1, param.getPageSize());
        Page<?> page = new PageImpl<>(billResponses, pageable, totalElements);

        return PageableResponse.builder()
                .pageNumber(param.getPageNo())
                .pageNo(param.getPageNo())
                .pageSize(param.getPageSize())
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .content(billResponses)
                .build();
    }

    public List<BillEditResponse> getAllBillEdit(Long billId) {
        // Constructing the SQL query for filtering bills based on billId
        StringBuilder sql = new StringBuilder("SELECT b FROM Bill b WHERE 1=1");

        // Checking if we need to filter by bill id
        if (billId != null) {
            sql.append(" AND b.id = :billId");
        }

        // Sorting the results by creation date
        sql.append(" ORDER BY b.createAt DESC");

        TypedQuery<Bill> query = entityManager.createQuery(sql.toString(), Bill.class);

        // Set parameter for billId
        if (billId != null) {
            query.setParameter("billId", billId);
        }

        // Execute the query and retrieve the list of bills
        List<Bill> bills = query.getResultList();

        // Convert bills to BillEditResponse
        return bills.stream()
                .map(bill -> {
                    // Check if 'createdBy' is not null and get employee if available
                    Employee employee = (bill.getCreatedBy() != null) ? getEmployeeByUserId(bill.getCreatedBy().getId()) : null;

                    return BillEditResponse.builder()
                            .id(bill.getId())
                            .code(bill.getCode())
                            .customer(bill.getCustomer())
                            .coupon(bill.getCoupon() != null ? mapCouponToBillCouponResponse(bill.getCoupon()) : null)
                            .status(bill.getBillStatus().getId())
                            .shipping(bill.getShipping())
                            .subtotal(bill.getSubtotal())
                            .sellerDiscount(bill.getSellerDiscount())
                            .total(bill.getTotal())
                            .paymentMethod(bill.getPaymentMethod())
                            .message(bill.getMessage())
                            .note(bill.getNote())
                            .paymentTime(bill.getPaymentTime())
                            .createAt(bill.getCreateAt())
                            .employee(employee)
                            .billDetails(bill.getBillDetails().stream()
                                    .map(this::convertToBillResponse)
                                    .collect(Collectors.toList()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    private BillCouponResponse mapCouponToBillCouponResponse(Coupon coupon) {
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
                .quantity(billDetail.getQuantity())
                .build();

        return BillDetailResponse.builder()
                .id(billDetail.getId())
                .productDetail(productDetailResponse)
                .quantity(billDetail.getQuantity())
                .retailPrice(retailPrice)
                .discountAmount(discountAmount)
                .build();
    }

    public Employee getEmployeeByUserId(Long userId) {
        String sql = "SELECT e FROM employees e WHERE e.user.id = :userId";
        TypedQuery<Employee> query = entityManager.createQuery(sql, Employee.class);
        query.setParameter("userId", userId);
        return query.getSingleResult();
    }

    private List<String> convertToUrl(List<ProductImage> images) {
        return images.stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
    }

    public List<BillStatusDetailResponse> getBillStatusDetailsByBillId(Long billId) {
        String sql = "SELECT bsd FROM BillStatusDetail bsd WHERE bsd.bill.id = :billId";
        TypedQuery<BillStatusDetail> query = entityManager.createQuery(sql, BillStatusDetail.class);
        query.setParameter("billId", billId);

        List<BillStatusDetail> billStatusDetails = query.getResultList();

        // Convert each BillStatusDetail to BillStatusDetailResponse
        List<BillStatusDetailResponse> responseList = new ArrayList<>();
        for (BillStatusDetail bsd : billStatusDetails) {
            BillStatusDetailResponse response = BillStatusDetailResponse.builder()
                    .bill(bsd.getBill().getId())
                    .billStatus(bsd.getBillStatus().getId())
                    .note(bsd.getNote())
                    .createAt(bsd.getCreateAt())
                    .build();

            responseList.add(response);
        }

        return responseList;
    }

}
