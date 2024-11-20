//package sd79.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import sd79.dto.requests.SupportRequest;
//import sd79.dto.response.ResponseData;
//import sd79.model.Support;
//import sd79.service.SupportService;
//
//@RestController
//@RequestMapping("api/${api.version}/support")
//public class SupportController {
//
//    private final SupportService supportService;
//
//    @Autowired
//    public SupportController(SupportService supportService) {
//        this.supportService = supportService;
//    }
//
//    // API để tạo một yêu cầu hỗ trợ mới
//    @PostMapping("/create")
//    public ResponseData<?> createSupportTicket(@RequestBody SupportRequest request) {
//        // Lấy thông tin customerId và issueDescription từ DTO
//        Long customerId = request.getCustomerId();
//        String issueDescription = request.getIssueDescription();
//
//        // Tạo yêu cầu hỗ trợ mới và thông báo cho nhân viên
//        Support newSupport = supportService.createSupportTicket(customerId, issueDescription);
//
//        // Trả về yêu cầu hỗ trợ mới dưới dạng JSON
//        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Gửi thành công");
//    }
//}
