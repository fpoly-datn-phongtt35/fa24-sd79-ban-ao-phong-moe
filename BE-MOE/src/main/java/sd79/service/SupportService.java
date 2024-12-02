package sd79.service;

import sd79.dto.requests.SupportRequest;
import sd79.model.Support;
import java.util.List;

public interface SupportService {
    Support createSupportRequest(SupportRequest request);

    List<Support> getAllSupportRequests(); // Thêm phương thức này

    Support updateSupportStatus(Long id, Integer newStatus);
}