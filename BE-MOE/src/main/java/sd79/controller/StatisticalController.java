package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.common.StatisticalParamFilter;
import sd79.dto.response.ResponseData;
import sd79.service.StatisticalService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/${api.version}/statistical")
@Tag(name = "Statistical Controller", description = "Quản lý thống kê")
@RequiredArgsConstructor
public class StatisticalController {

    private final StatisticalService statisticalService;

    @Operation(summary = "Get Total Revenue", description = "Get total revenue for the given time period.")
    @GetMapping("/revenue")
    public ResponseData<List<Object[]>> getTotalRevenue( StatisticalParamFilter filter) {
        List<Object[]> totalRevenue = statisticalService.getTotalRevenue(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved total revenue", totalRevenue);
    }

    @Operation(summary = "Get Total Bills", description = "Get total number of bills for the given time period.")
    @GetMapping("/bills")
    public ResponseData<List<Object[]>> getTotalBills( StatisticalParamFilter filter) {
        List<Object[]> totalBills = statisticalService.getTotalBills(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved total bills count", totalBills);
    }

    @Operation(summary = "Get Total Shipping Cost", description = "Get total shipping cost for the given time period.")
    @GetMapping("/shipping-cost")
    public ResponseData<List<Object[]>> getTotalShippingCost( StatisticalParamFilter filter) {
        List<Object[]> totalShippingCost = statisticalService.getTotalShippingCost(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved total shipping cost", totalShippingCost);
    }

    @Operation(summary = "Get Total Products Sold", description = "Get total number of products sold for the given time period.")
    @GetMapping("/products-sold")
    public ResponseData<List<Object[]>> getTotalProductsSold( StatisticalParamFilter filter) {
        List<Object[]> totalProductsSold = statisticalService.getTotalProductsSold(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved total products sold", totalProductsSold);
    }

    @Operation(summary = "Get Total Discount Amount", description = "Get total discount amount for the given time period.")
    @GetMapping("/discount-amount")
    public ResponseData<List<Object[]>> getTotalDiscountAmount( StatisticalParamFilter filter) {
        List<Object[]> totalDiscountAmount = statisticalService.getTotalDiscountAmount(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved total discount amount", totalDiscountAmount);
    }

    @Operation(summary = "Get Total Product Amount", description = "Get total amount from products excluding discounts for the given time period.")
    @GetMapping("/product-amount")
    public ResponseData<List<Object[]>> getTotalProductAmount( StatisticalParamFilter filter) {
        List<Object[]> totalProductAmount = statisticalService.getTotalProductAmount(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved total product amount", totalProductAmount);
    }

    @Operation(summary = "Get Summary Statistics", description = "Get a summary of all statistics for the given time period.")
    @GetMapping("/summary")
    public ResponseData<Map<String, List<Object[]>>> getSummaryStatistics( StatisticalParamFilter filter) {
        Map<String, List<Object[]>> summary = statisticalService.getSummaryStatistics(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved summary statistics", summary);
    }

    @Operation(summary = "Get Top Selling Products", description = "Get top selling products within the given time period.")
    @GetMapping("/top-selling-products")
    public ResponseData<List<Object[]>> getTopSellingProducts( StatisticalParamFilter filter, @RequestParam int limit) {
        List<Object[]> topSellingProducts = statisticalService.getTopSellingProducts(filter, limit);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved top selling products", topSellingProducts);
    }

    @Operation(summary = "Get Total Bills By Status", description = "Get Total Bills By Status within the given time period.")
    @GetMapping("/total-bill-status")
    public ResponseData<List<Object[]>> getTotalBillsByStatus( StatisticalParamFilter filter) {
        List<Object[]> totalBillsByStatus = statisticalService.getTotalBillsByStatus(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully total bills by status", totalBillsByStatus);
    }

    @Operation(summary = "Get Customer Registrations", description = "Get customer registrations within the given time period.")
    @GetMapping("/customer-registrations")
    public ResponseData<List<Object[]>> getCustomerRegistrations( StatisticalParamFilter filter) {
        List<Object[]> customerRegistrations = statisticalService.getCustomerRegistrations(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully customer registrations", customerRegistrations);
    }

    @Operation(summary = "Get Coupon Usage Statistics",
            description = "Retrieve coupon usage statistics within the given time period, optionally grouped by type.")
    @GetMapping("/coupon-usage")
    public ResponseData<List<Object[]>> getCouponUsage(StatisticalParamFilter filter){
        List<Object[]> couponUsage = statisticalService.getCouponUsage(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved coupon usage statistics", couponUsage);
    }

}
