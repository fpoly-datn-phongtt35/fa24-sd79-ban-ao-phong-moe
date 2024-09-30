package sd79.service;

import sd79.dto.requests.SizeRequest;
import sd79.dto.response.SizeResponse;

import java.util.List;

public interface SizeService {
    List<SizeResponse> getAllSizes();

    int storeSize(SizeRequest req);

    void updateSize(SizeRequest req, int id);

    void isDeleteSize(int id);
}
