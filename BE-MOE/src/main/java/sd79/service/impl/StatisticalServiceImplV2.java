package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.dto.requests.common.StatisticalParamFilter;
import sd79.repositories.customQuery.StatisticalCustomizeQueryV2;
import sd79.service.StatisticalServiceV2;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticalServiceImplV2 implements StatisticalServiceV2 {

    private final StatisticalCustomizeQueryV2 statisticalCustomizeQueryV2;

    @Override
    public List<Object[]> getBillsWithFilters(StatisticalParamFilter filter) {
        return statisticalCustomizeQueryV2.getBillsWithFilters(filter);
    }

    @Override
    public BigDecimal getTotalRevenue(StatisticalParamFilter filter) {
        return statisticalCustomizeQueryV2.getTotalRevenue(filter);
    }

    @Override
    public BigDecimal getMinInvoice(StatisticalParamFilter filter) {
        return statisticalCustomizeQueryV2.getMinInvoice(filter);
    }

    @Override
    public BigDecimal getMaxInvoice(StatisticalParamFilter filter) {
        return statisticalCustomizeQueryV2.getMaxInvoice(filter);
    }

    @Override
    public BigDecimal getAvgInvoice(StatisticalParamFilter filter) {
        return statisticalCustomizeQueryV2.getAvgInvoice(filter);
    }

    @Override
    public Long getTotalBills(StatisticalParamFilter filter) {
        return statisticalCustomizeQueryV2.getTotalBills(filter);
    }

    @Override
    public Long getSuccessfulBills(StatisticalParamFilter filter) {
        return statisticalCustomizeQueryV2.getSuccessfulBills(filter);
    }

    @Override
    public Long getFailedBills(StatisticalParamFilter filter) {
        return statisticalCustomizeQueryV2.getFailedBills(filter);
    }

    @Override
    public Long getUnpaidBills(StatisticalParamFilter filter) {
        return statisticalCustomizeQueryV2.getUnpaidBills(filter);
    }

    @Override
    public List<Object[]> getTopSellingProducts(StatisticalParamFilter filter) {
        return statisticalCustomizeQueryV2.getTopSellingProducts(filter);
    }

    @Override
    public List<Object[]> getTopCustomers(StatisticalParamFilter filter) {
        return statisticalCustomizeQueryV2.getTopCustomers(filter);
    }

    @Override
    public List<Object[]> getTopCoupons(StatisticalParamFilter filter) {
        return statisticalCustomizeQueryV2.getTopCoupons(filter);
    }
}
