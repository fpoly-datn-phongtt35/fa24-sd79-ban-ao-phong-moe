/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sd79.dto.response.ResponseData;
import sd79.service.payment.PaymentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/${api.version}/payment")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/vn-pay")
    public ResponseData<?> payRequest(HttpServletRequest request) {
        return new ResponseData<>(HttpStatus.OK.value(), "Pay Request", this.paymentService.createVnPayPayment(request));
    }

    @GetMapping("/vn-pay-callback")
    public ResponseData<?> payCallback(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        return new ResponseData<>(HttpStatus.OK.value(), "Pay Successfully", status);
    }
}
