package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.dto.requests.common.BillEditParamFilter;
import sd79.dto.requests.common.BillListParamFilter;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.bills.BillEditResponse;
import sd79.dto.response.clients.invoices.InvoiceResponse;
import sd79.repositories.customQuery.BillCustomizeQuery;
import sd79.service.BillListService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BillListServiceImpl implements BillListService {

    private final BillCustomizeQuery billCustomizeQuery;

    @Override
    public PageableResponse getAllBillList(BillListParamFilter param) {
        if (param.getPageNo() < 1) {
            param.setPageNo(1);
        }
        return this.billCustomizeQuery.getAllBillList(param);
    }

    @Override
    public List<BillEditResponse> getAllBillEdit(Long billId) {
        return this.billCustomizeQuery.getAllBillEdit(billId);
    }
}
