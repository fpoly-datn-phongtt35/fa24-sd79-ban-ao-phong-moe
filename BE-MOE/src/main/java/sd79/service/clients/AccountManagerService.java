package sd79.service.clients;

import sd79.dto.requests.CustomerReq;
import sd79.dto.requests.clients.accountInfo.AccountImageReq;
import sd79.dto.requests.productRequests.AddressAccountRequest;
import sd79.dto.requests.productRequests.CustomerRequest;
import sd79.dto.requests.productRequests.PassWordRequest;
import sd79.dto.requests.productRequests.ProductRequest;
import sd79.dto.response.clients.customer.UserAccountInfoRes;
import sd79.dto.response.clients.customer.UserAddressInfoRes;
import sd79.service.clients.impl.AccountManagerServiceImpl;

public interface AccountManagerService {
    UserAccountInfoRes getAccountbyId(Long id);
    UserAddressInfoRes getAddressbyId(Long id);
    long accountInformation(Long id, CustomerRequest customerRequest);
    long addressInformation(Long id, AddressAccountRequest addressAccountRequest);
    long UpdatePassWord(Long id, PassWordRequest passWordRequest);
    void updateImageAccInfo(AccountImageReq req);
    long createFavouriteProduct(ProductRequest productRequest);

}
