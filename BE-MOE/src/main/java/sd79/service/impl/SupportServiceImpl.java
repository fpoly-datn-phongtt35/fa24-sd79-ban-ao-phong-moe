package sd79.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sd79.dto.requests.SupportRequest;
import sd79.exception.EntityNotFoundException;
import sd79.model.Support;
import sd79.repositories.SupportRepository;
import sd79.service.SupportService;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class SupportServiceImpl implements SupportService {
    private final SupportRepository supportRepository;


    @Autowired
    public SupportServiceImpl(SupportRepository supportRepository) {
        this.supportRepository = supportRepository;
    }

//    @Override
//    public Page<Support> getAllSupportRequests(Pageable pageable) {
//        return supportRepository.findAll(pageable);
//    }


    @Override
    public Support updateSupportStatus(Long id, Integer newStatus) {
        // Kiểm tra xem yêu cầu hỗ trợ có tồn tại hay không
        Support support = supportRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy yêu cầu hỗ trợ với ID: " + id));

        // Cập nhật trạng thái
        support.setStatus(newStatus);
        support.setResolvedDate(LocalDateTime.now());

        return supportRepository.save(support);
    }

    @Override
    public List<Support> getAllSupportRequests() {
        return supportRepository.findAll(); // Lấy tất cả các yêu cầu hỗ trợ
    }
    @Override
    public void deleteSupportRequest(Long id) {
        if (!supportRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy yêu cầu hỗ trợ với ID: " + id);
        }
        supportRepository.deleteById(id);
    }



    @Override
    public Support createSupportRequest(SupportRequest request) {
        Support support = new Support();
        support.setHoTen(request.getHoTen());
        support.setIssueDescription(request.getIssueDescription());
        support.setEmail(request.getEmail());
        support.setSdt(request.getSdt());
        support.setStatus(0); // Trạng thái mặc định là 0
        support.setCreatedDate(LocalDateTime.now());
        return supportRepository.save(support);
    }


}


