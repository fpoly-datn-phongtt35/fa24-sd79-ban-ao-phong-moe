/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
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
