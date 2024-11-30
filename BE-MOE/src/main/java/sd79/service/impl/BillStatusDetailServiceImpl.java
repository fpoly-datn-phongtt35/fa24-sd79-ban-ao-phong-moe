package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.BillStatusDetailRequest;
import sd79.dto.response.bills.BillStatusDetailResponse;
import sd79.exception.EntityNotFoundException;
import sd79.exception.InvalidDataException;
import sd79.model.*;
import sd79.repositories.*;
import sd79.repositories.auth.UserRepository;
import sd79.repositories.customQuery.BillCustomizeQuery;
import sd79.repositories.products.ProductDetailRepository;
import sd79.service.BillStatusDetailService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

        // Count how many times this status has been applied to the bill
        long statusCount = billStatusDetailRepo.countByBillAndBillStatus(bill, billStatus);

        // If the status has already been applied 2 times, throw an exception
        if (statusCount >= 2) {
            throw new InvalidDataException("Trạng thái này đã tồn tại hoặc bạn không thể khôi phục được trạng thái nữa");
        }

        // Create a new BillStatusDetail if the count is less than 2
        BillStatusDetail billStatusDetail = new BillStatusDetail();
        billStatusDetail.setBill(bill);
        billStatusDetail.setBillStatus(billStatus);
        billStatusDetail.setNote(request.getNote());
        billStatusDetail.setCreatedBy(getUserById(request.getUserId()));
        billStatusDetail.setUpdatedBy(getUserById(request.getUserId()));

        // Save the new BillStatusDetail
        this.billStatusDetailRepo.save(billStatusDetail);

        // Return the ID of the newly created BillStatusDetail
        return billStatusDetail.getId();
    }

    @Override
    public long addBillStatusDetailV2(BillStatusDetailRequest request) {
        Bill bill = billRepository.findById(request.getBill())
                .orElseThrow(() -> new IllegalArgumentException("Bill not found"));
        BillStatus billStatus = billStatusRepository.findById(request.getBillStatus())
                .orElseThrow(() -> new IllegalArgumentException("BillStatus not found"));

        // Nếu chưa tồn tại, tạo mới trạng thái hóa đơn
        BillStatusDetail billStatusDetail = new BillStatusDetail();
        billStatusDetail.setBill(bill);
        billStatusDetail.setBillStatus(billStatus);
        billStatusDetail.setNote(request.getNote());
        billStatusDetail.setCreatedBy(getUserById(request.getUserId()));
        billStatusDetail.setUpdatedBy(getUserById(request.getUserId()));

        this.billStatusDetailRepo.save(billStatusDetail);
        return billStatusDetail.getId();
    }

    public Page<Integer> getPreviousBillStatus(Long billId, Pageable pageable) {
        return billCustomizeQuery.findPreviousBillStatusId(billId, pageable);
    }

    private User getUserById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy user"));
    }
}
