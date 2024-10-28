/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
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
