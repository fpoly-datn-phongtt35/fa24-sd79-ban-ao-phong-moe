package sd79.service;

import sd79.dto.requests.productRequests.ColorRequest;
import sd79.dto.response.productResponse.ColorResponse;

import java.util.List;

public interface ColorService {
    List<ColorResponse> getAllColors(String keyword);

    int storeColor(ColorRequest request);

    void updateColor(ColorRequest request, int id);

    void isDeleteColor(int id);
}
