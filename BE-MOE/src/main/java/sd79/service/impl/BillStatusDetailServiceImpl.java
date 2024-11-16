package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.BillStatusDetailRequest;
import sd79.dto.response.bills.BillStatusDetailResponse;
import sd79.exception.EntityNotFoundException;
import sd79.model.Bill;
import sd79.model.BillStatus;
import sd79.model.BillStatusDetail;
import sd79.model.User;
import sd79.repositories.BillRepo;
import sd79.repositories.BillStatusDetailRepo;
import sd79.repositories.BillStatusRepo;
import sd79.repositories.auth.UserRepository;
import sd79.repositories.customQuery.BillCustomizeQuery;
import sd79.service.BillStatusDetailService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BillStatusDetailServiceImpl implements BillStatusDetailService {

    private final BillRepo billRepository;
    private final BillStatusRepo billStatusRepository;
    private final BillStatusDetailRepo billStatusDetailRepo;
    private final UserRepository userRepository;
    private final BillCustomizeQuery billCustomizeQuery;

    @Override
    public List<BillStatusDetailResponse> getBillStatusDetailsByBillId(Long billId) {
        return this.billCustomizeQuery.getBillStatusDetailsByBillId(billId);
    }

    @Override
    public long addBillStatusDetail(BillStatusDetailRequest request) {
        Bill bill = billRepository.findById(request.getBill())
                .orElseThrow(() -> new IllegalArgumentException("Bill not found"));
        BillStatus billStatus = billStatusRepository.findById(request.getBillStatus())
                .orElseThrow(() -> new IllegalArgumentException("BillStatus not found"));

        BillStatusDetail billStatusDetail = new BillStatusDetail();
        billStatusDetail.setBill(bill);
        billStatusDetail.setBillStatus(billStatus);
        billStatusDetail.setNote(request.getNote());

        billStatusDetail.setCreatedBy(getUserById(request.getUserId()));
        billStatusDetail.setUpdatedBy(getUserById(request.getUserId()));
        this.billStatusDetailRepo.save(billStatusDetail);
        return billStatusDetail.getId();
    }

    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy user"));
    }
}
