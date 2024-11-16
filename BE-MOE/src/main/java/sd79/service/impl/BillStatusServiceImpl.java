package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sd79.model.BillStatus;
import sd79.repositories.BillStatusRepo;
import sd79.service.BillStatusService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BillStatusServiceImpl implements BillStatusService {

    private final BillStatusRepo billStatusRepo;

    @Override
    public List<BillStatus> getAllBillStatus() {
        return this.billStatusRepo.findAll();
    }
}
