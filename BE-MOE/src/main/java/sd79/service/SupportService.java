package sd79.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sd79.dto.requests.SupportRequest;
import sd79.model.Support;
import java.util.List;

public interface SupportService {
    Support createSupportRequest(SupportRequest request);

//    Page<Support> getAllSupportRequests(Pageable pageable);

    Support updateSupportStatus(Long id, Integer newStatus);

    void deleteSupportRequest(Long id);
    List<Support> getAllSupportRequests(); // Thêm phương thức này

}