package sd79.service;

import sd79.dto.requests.common.StatisticalParamFilter;

import java.util.List;
import java.util.Map;

/**
 * Interface định nghĩa các dịch vụ thống kê.
 */
public interface StatisticalService {

    List<Object[]> getTotalRevenue(StatisticalParamFilter filter);

    List<Object[]> getTotalBills(StatisticalParamFilter filter);

    List<Object[]> getTotalShippingCost(StatisticalParamFilter filter);

    List<Object[]> getTotalProductsSold(StatisticalParamFilter filter);

    List<Object[]> getTotalDiscountAmount(StatisticalParamFilter filter);

    List<Object[]> getTotalProductAmount(StatisticalParamFilter filter);

    Map<String, List<Object[]>> getSummaryStatistics(StatisticalParamFilter filter);

    List<Object[]> getTopSellingProducts(StatisticalParamFilter filter, int limit);

    List<Object[]> getRevenueByPeriod(StatisticalParamFilter filter);
}
