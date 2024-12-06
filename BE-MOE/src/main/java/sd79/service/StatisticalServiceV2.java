package sd79.service;

import sd79.dto.requests.common.StatisticalParamFilter;

import java.math.BigDecimal;
import java.util.List;

public interface StatisticalServiceV2 {
    List<Object[]> getBillsWithFilters(StatisticalParamFilter filter);
    BigDecimal getTotalRevenue(StatisticalParamFilter filter);
    BigDecimal getMinInvoice(StatisticalParamFilter filter);
    BigDecimal getMaxInvoice(StatisticalParamFilter filter);
    BigDecimal getAvgInvoice(StatisticalParamFilter filter);
    Long getTotalBills(StatisticalParamFilter filter);
    Long getSuccessfulBills(StatisticalParamFilter filter);
    Long getFailedBills(StatisticalParamFilter filter);
    Long getUnpaidBills(StatisticalParamFilter filter);
}
