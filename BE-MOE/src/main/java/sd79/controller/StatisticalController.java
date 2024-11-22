package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
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

    @Operation(summary = "Get Revenue By Period", description = "Get revenue statistics grouped by the specified period granularity for the given time period.")
    @GetMapping("/revenue-by-period")
    public ResponseData<List<Object[]>> getRevenueByPeriod( StatisticalParamFilter filter) {
        List<Object[]> revenueByPeriod = statisticalService.getRevenueByPeriod(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully retrieved revenue by period", revenueByPeriod);
    }
}
