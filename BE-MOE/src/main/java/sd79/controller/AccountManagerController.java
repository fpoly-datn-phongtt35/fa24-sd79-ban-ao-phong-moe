package sd79.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.productRequests.CustomerRequest;
import sd79.dto.response.ResponseData;
import sd79.service.clients.AccountManager;

@RestController
@RequestMapping("/api/${api.version}/accountManager")
@RequiredArgsConstructor
public class AccountManagerController {
    private AccountManager manager;

    @PutMapping("/update/{id}")
    public ResponseData<?> accountInformation(@PathVariable Long id, @Valid @RequestBody CustomerRequest customerRequest) {
        return new ResponseData<>(HttpStatus.OK.value(), "Sửa thông tin thành công", manager.accountInformation(id, customerRequest));
    }
}
