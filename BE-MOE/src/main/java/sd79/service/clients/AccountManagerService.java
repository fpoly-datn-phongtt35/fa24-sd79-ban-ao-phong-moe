package sd79.service.clients;

import sd79.dto.requests.clients.accountInfo.AccountImageReq;
import sd79.dto.requests.productRequests.CustomerRequest;
import sd79.dto.response.clients.customer.UserAccountInfoRes;
import sd79.dto.response.clients.customer.UserAddressInfoRes;
import sd79.service.clients.impl.AccountManagerServiceImpl;

public interface AccountManagerService {
    UserAccountInfoRes getAccountbyId(Long id);
    UserAddressInfoRes getAddressbyId(Long id);
    long accountInformation(Long id, CustomerRequest customerRequest);
    void updateImageAccInfo(AccountImageReq req);

}
