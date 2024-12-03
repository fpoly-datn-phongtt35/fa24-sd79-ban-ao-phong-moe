/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sd79.dto.response.ResponseData;
import sd79.repositories.StatisticRepository;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/${api.version}/statistic")
public class DashboardController {
    private final StatisticRepository statisticRepository;

    @GetMapping
    public ResponseData<?> getStatistic() {
        return new ResponseData<>(HttpStatus.OK.value(), "Successfully", statisticRepository.getData());
    }
}
