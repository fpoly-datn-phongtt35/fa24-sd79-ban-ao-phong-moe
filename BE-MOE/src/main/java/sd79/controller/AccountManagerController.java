package sd79.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.clients.accountInfo.AccountImageReq;
import sd79.dto.requests.productRequests.CustomerRequest;
import sd79.dto.requests.productRequests.ProductImageReq;
import sd79.dto.response.ResponseData;
import sd79.repositories.auth.UserAuthRepository;
import sd79.service.clients.AccountManagerService;

@RestController
@RequestMapping("/api/${api.version}/accountManager")
@RequiredArgsConstructor
public class AccountManagerController {
    private final AccountManagerService accountManagerService;

    private final UserAuthRepository userAuthRepository;

    @GetMapping("/detailAccount/{id}")
    public ResponseData<?> getAccountInfoById(@PathVariable Long id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Customer details", accountManagerService.getAccountbyId(id));
    }

    @GetMapping("/detailAddress/{id}")
    public ResponseData<?> getUserAddressById(@PathVariable Long id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Customer details", accountManagerService.getAddressbyId(id));
    }

    @PutMapping("/updateAccount/{id}")
    public ResponseData<?> accountInformation(@PathVariable Long id, @Valid @RequestBody CustomerRequest customerRequest) {
        return new ResponseData<>(HttpStatus.OK.value(), "Sửa thông tin thành công", accountManagerService.accountInformation(id, customerRequest));
    }
    @PostMapping("/upload")
    public ResponseData<?> uploadFile(@Valid @ModelAttribute AccountImageReq request) {
        this.accountManagerService.updateImageAccInfo(request);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Successfully added customer images");
    }

}
