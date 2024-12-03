package sd79.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.SupportRequest;
import sd79.dto.response.ResponseData;
import sd79.model.Support;
import sd79.service.SupportService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/${api.version}/client/support")
public class SupportController {

    private final SupportService supportService;

    @Autowired
    public SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    // API để lấy tất cả yêu cầu hỗ trợ
//    @GetMapping("/getAll")
//    public ResponseData<?> getAllSupportRequests(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "5") int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        Page<Support> supportRequests = supportService.getAllSupportRequests(pageable);
//        return new ResponseData<>(HttpStatus.OK.value(), "Danh sách yêu cầu hỗ trợ", supportRequests);
//    }


    // API để tạo một yêu cầu hỗ trợ mới
    @PostMapping("/create")
    public ResponseData<?> createSupportTicket(@RequestBody SupportRequest request) {
        supportService.createSupportRequest(request);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Gửi thành công");
    }
    // API để cập nhật trạng thái yêu cầu hỗ trợ
    @PutMapping("/updateStatus/{id}")
    public ResponseData<?> updateSupportStatus(@PathVariable Long id, @RequestBody Map<String, Integer> payload) {
        Integer status = payload.get("status");
        supportService.updateSupportStatus(id, status);
        return new ResponseData<>(HttpStatus.OK.value(), "Cập nhật trạng thái thành công");
    }
    @DeleteMapping("/delete/{id}")
    public ResponseData<?> deleteSupportRequest(@PathVariable Long id) {
        supportService.deleteSupportRequest(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Xóa yêu cầu hỗ trợ thành công");
    }
    @GetMapping("/getAll")
    public ResponseData<?> getAllSupport() {
        List<Support> supportRequests = supportService.getAllSupportRequests();
        return new ResponseData<>(HttpStatus.OK.value(), "Danh sách yêu cầu hỗ trợ", supportRequests);
    }

}


