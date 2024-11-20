package sd79.service;

import sd79.dto.requests.common.BillEditParamFilter;
import sd79.dto.requests.common.BillListParamFilter;
import sd79.dto.response.PageableResponse;
import sd79.dto.response.bills.BillEditResponse;

import java.util.List;

public interface BillListService {
    PageableResponse getAllBillList(BillListParamFilter param);
    List<BillEditResponse> getAllBillEdit(Long billId);
    void deleteBill(Long billId);
}
