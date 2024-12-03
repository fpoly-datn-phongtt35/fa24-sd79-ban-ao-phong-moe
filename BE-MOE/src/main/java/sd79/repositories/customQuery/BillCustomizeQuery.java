package sd79.repositories.customQuery;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
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

    public PageableResponse getAllBillList(BillListParamFilter param, Integer userId) {
        // Tìm `Employee` trực tiếp từ `userId`
        Employee employee = entityManager.createQuery(
                        "SELECT e FROM employees e WHERE e.user.id = :userId AND e.user.isDeleted = false", Employee.class)
                .setParameter("userId", userId)
                .getSingleResult();

        if (employee == null || employee.getUser() == null || employee.getUser().getIsDeleted()) {
            throw new InvalidDataException("User not found or is deleted");
        }

        // Lấy chức vụ của `Employee`
        Integer employeePositionId = employee.getPosition().getId();

        List<Integer> allowedStatusIds = List.of(1, 2, 3, 4, 7, 8);
        Integer status = param.getStatus();

        // Nếu không có trạng thái, mặc định là trạng thái 2
        status = status != null ? status : 2;
        if (!allowedStatusIds.contains(status)) {
            throw new InvalidDataException("Status ID is invalid");
        }

        // Xây dựng câu truy vấn JPQL
        StringBuilder sql = new StringBuilder("SELECT b FROM Bill b LEFT JOIN b.customer c WHERE b.isDeleted = false");

        // Phân quyền dựa vào chức vụ
        if (employeePositionId == 2) {
            sql.append(" AND b.createdBy.id = :userId");
        }

        // Điều kiện tìm kiếm
        if (StringUtils.hasLength(param.getKeyword())) {
            sql.append(" AND (");
            String[] keywords = param.getKeyword().trim().toLowerCase().split("\\s+");
            for (int i = 0; i < keywords.length; i++) {
                if (i > 0) sql.append(" AND ");
                sql.append("(LOWER(c.firstName) LIKE :keyword").append(i)
                        .append(" OR LOWER(c.lastName) LIKE :keyword").append(i)
                        .append(" OR LOWER(b.code) LIKE :keyword").append(i).append(")");
            }
            sql.append(")");
        }

        if (param.getStartDate() != null) {
            sql.append(" AND Date(b.createAt) >= :startDate");
        }

        if (param.getEndDate() != null) {
            sql.append(" AND Date(b.createAt) <= :endDate");
        }

        if (param.getMinTotal() != null) {
            sql.append(" AND b.total >= :minTotal");
        }

        if (param.getMaxTotal() != null) {
            sql.append(" AND b.total <= :maxTotal");
        }

        sql.append(" AND b.billStatus.id = :statusId");

        if (status == 2) {
            sql.append(" ORDER BY b.createAt ASC");  // Thời gian lâu nhất lên đầu
        } else if (status == 8) {
            sql.append(" ORDER BY b.createAt DESC"); // Thời gian mới nhất lên đầu
        } else {
            sql.append(" ORDER BY b.createAt DESC"); // Mặc định nếu cần
        }

        TypedQuery<Bill> query = entityManager.createQuery(sql.toString(), Bill.class);

        if (StringUtils.hasLength(param.getKeyword())) {
            String[] keywords = param.getKeyword().trim().toLowerCase().split("\\s+");
            for (int i = 0; i < keywords.length; i++) {
                query.setParameter("keyword" + i, "%" + keywords[i] + "%");
            }
        }

        if (param.getStartDate() != null) query.setParameter("startDate", param.getStartDate());
        if (param.getEndDate() != null) query.setParameter("endDate", param.getEndDate());
        if (param.getMinTotal() != null) query.setParameter("minTotal", param.getMinTotal());
        if (param.getMaxTotal() != null) query.setParameter("maxTotal", param.getMaxTotal());
        query.setParameter("statusId", status);

        if (employeePositionId == 2) {
            query.setParameter("userId", userId);
        }

        // Phân trang
        query.setFirstResult((param.getPageNo() - 1) * param.getPageSize());
        query.setMaxResults(param.getPageSize());

        List<BillListResponse> billResponses = query.getResultList().stream()
                .map(bill -> BillListResponse.builder()
                        .id(bill.getId())
                        .code(bill.getCode())
                        .customer(bill.getCustomer())
                        .total(bill.getTotal())
                        .billStatus(bill.getBillStatus().getId())
                        .createAt(bill.getCreateAt())
                        .build())
                .toList();

        // Truy vấn số lượng bản ghi
        StringBuilder countSql = new StringBuilder("SELECT COUNT(b) FROM Bill b LEFT JOIN b.customer c WHERE b.isDeleted = false");

        if (employeePositionId == 2) {
            countSql.append(" AND b.createdBy.id = :userId");
        }

        if (StringUtils.hasLength(param.getKeyword())) {
            countSql.append(" AND (");
            String[] keywords = param.getKeyword().trim().toLowerCase().split("\\s+");
            for (int i = 0; i < keywords.length; i++) {
                if (i > 0) countSql.append(" AND ");
                countSql.append("(LOWER(c.firstName) LIKE :keyword").append(i)
                        .append(" OR LOWER(c.lastName) LIKE :keyword").append(i)
                        .append(" OR LOWER(b.code) LIKE :keyword").append(i).append(")");
            }
            countSql.append(")");
        }

        if (param.getStartDate() != null) {
            countSql.append(" AND Date(b.createAt) >= :startDate");
        }

        if (param.getEndDate() != null) {
            countSql.append(" AND Date(b.createAt) <= :endDate");
        }

        if (param.getMinTotal() != null) {
            countSql.append(" AND b.total >= :minTotal");
        }

        if (param.getMaxTotal() != null) {
            countSql.append(" AND b.total <= :maxTotal");
        }

        countSql.append(" AND b.billStatus.id = :statusId");
        if (status == 2) {
            sql.append(" ORDER BY b.createAt ASC");  // Thời gian lâu nhất lên đầu cho trạng thái 2
        } else if (status == 8) {
            sql.append(" ORDER BY b.createAt DESC"); // Thời gian mới nhất lên đầu cho trạng thái 8
        } else {
            sql.append(" ORDER BY b.createAt DESC"); // Sắp xếp mặc định
        }

        TypedQuery<Long> countQuery = entityManager.createQuery(countSql.toString(), Long.class);

        if (StringUtils.hasLength(param.getKeyword())) {
            String[] keywords = param.getKeyword().trim().toLowerCase().split("\\s+");
            for (int i = 0; i < keywords.length; i++) {
                countQuery.setParameter("keyword" + i, "%" + keywords[i] + "%");
            }
        }

        if (param.getStartDate() != null) countQuery.setParameter("startDate", param.getStartDate());
        if (param.getEndDate() != null) countQuery.setParameter("endDate", param.getEndDate());
        if (param.getMinTotal() != null) countQuery.setParameter("minTotal", param.getMinTotal());
        if (param.getMaxTotal() != null) countQuery.setParameter("maxTotal", param.getMaxTotal());
        countQuery.setParameter("statusId", status);

        if (employeePositionId == 2) {
            countQuery.setParameter("userId", userId);
        }

        Long totalElements = countQuery.getSingleResult();

        Pageable pageable = PageRequest.of(param.getPageNo() - 1, param.getPageSize());
        Page<?> page = new PageImpl<>(billResponses, pageable, totalElements);

        return PageableResponse.builder()
                .pageNumber(param.getPageNo())
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

    public Page<Integer> findPreviousBillStatusId(Long billId, Pageable pageable) {
        // Query to get the current status of the bill
        String currentStatusSql = """
    SELECT bsd.id
    FROM BillStatusDetail bsd
    WHERE bsd.bill.id = :billId
    ORDER BY bsd.id DESC
    """;

        TypedQuery<Long> currentStatusQuery = entityManager.createQuery(currentStatusSql, Long.class);
        currentStatusQuery.setParameter("billId", billId);
        currentStatusQuery.setMaxResults(1); // LIMIT 1
        Long currentStatusId = currentStatusQuery.getSingleResult();

        // Query to get all previous statuses in order
        String allStatusesSql = """
    SELECT bsd.billStatus.id
    FROM BillStatusDetail bsd
    WHERE bsd.bill.id = :billId
    ORDER BY bsd.id DESC
    """;

        TypedQuery<Integer> allStatusesQuery = entityManager.createQuery(allStatusesSql, Integer.class);
        allStatusesQuery.setParameter("billId", billId);
        List<Integer> allStatuses = allStatusesQuery.getResultList();

        // Logic to determine the previous status based on the current sequence
        Integer previousStatus = null;

        // Check for the specific sequences and set the previous status accordingly
        if (allStatuses.contains(1) && allStatuses.contains(2) && allStatuses.contains(5) && allStatuses.contains(3) && allStatuses.contains(5)) {
            // Rule for going back to 2 if the sequence is 1, 2, 5, 3, 5
            previousStatus = 2;
        } else if (allStatuses.contains(1) && allStatuses.contains(2) && allStatuses.contains(5) && allStatuses.contains(3)) {
            // Rule for going back to 5 if the sequence is 1, 2, 5, 3
            previousStatus = 5;
        } else if (allStatuses.contains(1) || allStatuses.contains(2) || allStatuses.contains(5)) {
            // Rule for going back to 2 if in 1, 2, or 5
            previousStatus = 2;
        } else if (allStatuses.contains(1) && allStatuses.contains(2) && allStatuses.contains(5) && allStatuses.contains(3)) {
            // Rule for going back to 5 if in 1, 2, 5, 3
            previousStatus = 5;
        } else if (allStatuses.contains(1) && allStatuses.contains(2) && allStatuses.contains(5) && allStatuses.contains(3) && allStatuses.contains(5)) {
            // Rule for going back to 2 if in 1, 2, 5, 3, 5
            previousStatus = 2;
        }

        // Query to find the previous status of the bill based on the modified logic
        String sql = """
    SELECT bsd.billStatus.id
    FROM BillStatusDetail bsd
    WHERE bsd.bill.id = :billId
      AND bsd.billStatus.id = :previousStatus
    ORDER BY bsd.id DESC
    """;

        TypedQuery<Integer> query = entityManager.createQuery(sql, Integer.class);
        query.setParameter("billId", billId);
        query.setParameter("previousStatus", previousStatus);

        // Apply pagination
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Integer> result = query.getResultList();

        // Count query to get the total number of records
        String countSql = """
    SELECT COUNT(bsd)
    FROM BillStatusDetail bsd
    WHERE bsd.bill.id = :billId
      AND bsd.billStatus.id = :previousStatus
    """;

        TypedQuery<Long> countQuery = entityManager.createQuery(countSql, Long.class);
        countQuery.setParameter("billId", billId);
        countQuery.setParameter("previousStatus", previousStatus);
        Long totalElements = countQuery.getSingleResult();

        // Return paginated result
        return new PageImpl<>(result, pageable, totalElements);
    }


}
