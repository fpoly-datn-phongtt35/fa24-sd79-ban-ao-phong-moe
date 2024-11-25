package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.dto.requests.common.StatisticalParamFilter;
import sd79.repositories.customQuery.StatisticalCustomizeQuery;
import sd79.service.StatisticalService;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatisticalServiceImpl implements StatisticalService {

    private final StatisticalCustomizeQuery statisticalCustomizeQuery;

    /**
     * Lấy tổng doanh thu trong khoảng thời gian.
     */
    @Override
    public List<Object[]> getTotalRevenue(StatisticalParamFilter filter) {
        return statisticalCustomizeQuery.getTotalRevenue(filter);
    }

    /**
     * Lấy tổng số hóa đơn trong khoảng thời gian.
     */
    @Override
    public List<Object[]> getTotalBills(StatisticalParamFilter filter) {
        return statisticalCustomizeQuery.getTotalBills(filter);
    }

    /**
     * Lấy tổng phí vận chuyển trong khoảng thời gian.
     */
    @Override
    public List<Object[]> getTotalShippingCost(StatisticalParamFilter filter) {
        return statisticalCustomizeQuery.getTotalShippingCost(filter);
    }

    /**
     * Lấy tổng số lượng sản phẩm bán được trong khoảng thời gian.
     */
    @Override
    public List<Object[]> getTotalProductsSold(StatisticalParamFilter filter) {
        return statisticalCustomizeQuery.getTotalProductsSold(filter);
    }

    /**
     * Lấy tổng giá trị giảm giá áp dụng trong khoảng thời gian.
     */
    @Override
    public List<Object[]> getTotalDiscountAmount(StatisticalParamFilter filter) {
        return statisticalCustomizeQuery.getTotalDiscountAmount(filter);
    }

    /**
     * Lấy tổng số tiền từ sản phẩm trong khoảng thời gian.
     */
    @Override
    public List<Object[]> getTotalProductAmount(StatisticalParamFilter filter) {
        return statisticalCustomizeQuery.getTotalProductAmount(filter);
    }

    /**
     * Lấy thống kê chi tiết tổng hợp.
     */
    @Override
    public Map<String, List<Object[]>> getSummaryStatistics(StatisticalParamFilter filter) {
        return statisticalCustomizeQuery.getSummaryStatistics(filter);
    }

    /**
     * Lấy danh sách top sản phẩm bán chạy nhất trong khoảng thời gian.
     */
    @Override
    public List<Object[]> getTopSellingProducts(StatisticalParamFilter filter, int limit) {
        return statisticalCustomizeQuery.getTopSellingProducts(filter, limit);
    }

    /**
     * Lấy danh sách hóa đơn thành công với thất bại
     */
    public List<Object[]> getTotalBillsByStatus(StatisticalParamFilter filter){
        return statisticalCustomizeQuery.getTotalBillsByStatus(filter);
    }

    /**
     * Lấy doanh thu phân chia theo các giai đoạn (ngày, tuần, tháng, năm) trong khoảng thời gian.
     */
    @Override
    public List<Object[]> getCustomerRegistrations(StatisticalParamFilter filter) {
        return statisticalCustomizeQuery.getCustomerRegistrations(filter);
    }
}
