package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.common.StatisticalParamFilter;
import sd79.dto.response.ResponseData;
import sd79.service.StatisticalServiceV2;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("api/${api.version}/statisticalV2")
@Tag(name = "Statistical Controller V2", description = "Quản lý thống kê")
@RequiredArgsConstructor
public class StatisticalControllerV2 {

    private final StatisticalServiceV2 statisticalServiceV2;

    @Operation(summary = "Get filtered bills", description = "Retrieve filtered bill data based on provided criteria")
    @PostMapping("/bills")
    public ResponseData<List<Object[]>> getBillsWithFilters(@RequestBody StatisticalParamFilter filter) {
        List<Object[]> result = statisticalServiceV2.getBillsWithFilters(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully bills", result);
    }

    @Operation(summary = "Get total revenue", description = "Calculate total revenue based on provided criteria")
    @PostMapping("/revenue")
    public ResponseData<BigDecimal> getTotalRevenue(@RequestBody StatisticalParamFilter filter) {
        BigDecimal totalRevenue = statisticalServiceV2.getTotalRevenue(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully revenue", totalRevenue);
    }

    @Operation(summary = "Get minimum invoice", description = "Calculate the minimum invoice total")
    @PostMapping("/min-invoice")
    public ResponseData<BigDecimal> getMinInvoice(@RequestBody StatisticalParamFilter filter) {
        BigDecimal minInvoice = statisticalServiceV2.getMinInvoice(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully fetched minimum invoice", minInvoice);
    }

    @Operation(summary = "Get maximum invoice", description = "Calculate the maximum invoice total")
    @PostMapping("/max-invoice")
    public ResponseData<BigDecimal> getMaxInvoice(@RequestBody StatisticalParamFilter filter) {
        BigDecimal maxInvoice = statisticalServiceV2.getMaxInvoice(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully fetched maximum invoice", maxInvoice);
    }

    @Operation(summary = "Get average invoice", description = "Calculate the average invoice total")
    @PostMapping("/avg-invoice")
    public ResponseData<BigDecimal> getAvgInvoice(@RequestBody StatisticalParamFilter filter) {
        BigDecimal avgInvoice = statisticalServiceV2.getAvgInvoice(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully fetched average invoice", avgInvoice);
    }

    @Operation(summary = "Get total number of bills", description = "Get the total count of invoices")
    @PostMapping("/total-bills")
    public ResponseData<Long> getTotalBills(@RequestBody StatisticalParamFilter filter) {
        Long totalBills = statisticalServiceV2.getTotalBills(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully fetched total number of bills", totalBills);
    }


    @Operation(summary = "Get total successful bills", description = "Get the total number of successful bills")
    @PostMapping("/successful-bills")
    public ResponseData<Long> getSuccessfulBills(@RequestBody StatisticalParamFilter filter) {
        Long successfulBills = statisticalServiceV2.getSuccessfulBills(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully fetched successful bills count", successfulBills);
    }

    @Operation(summary = "Get total failed bills", description = "Get the total number of failed bills")
    @PostMapping("/failed-bills")
    public ResponseData<Long> getFailedBills(@RequestBody StatisticalParamFilter filter) {
        Long failedBills = statisticalServiceV2.getFailedBills(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully fetched failed bills count", failedBills);
    }

    @Operation(summary = "Get total unpaid bills", description = "Get the total number of unpaid bills")
    @PostMapping("/unpaid-bills")
    public ResponseData<Long> getUnpaidBills(@RequestBody StatisticalParamFilter filter) {
        Long unpaidBills = statisticalServiceV2.getUnpaidBills(filter);
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully fetched unpaid bills count", unpaidBills);
    }
}
