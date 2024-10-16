package sd79.service;

import sd79.dto.requests.productRequests.SizeRequest;
import sd79.dto.response.productResponse.SizeResponse;

import java.util.List;

public interface SizeService {
    List<SizeResponse> getAllSizes(String keyword);

    int storeSize(SizeRequest req);

    void updateSize(SizeRequest req, int id);

    void isDeleteSize(int id);
}
