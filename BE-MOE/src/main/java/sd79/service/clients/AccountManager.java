package sd79.service.clients;

import sd79.dto.requests.productRequests.CustomerRequest;
import sd79.service.clients.impl.AccountManagerImpl;

public interface AccountManager  {
    long accountInformation(Long id, CustomerRequest customerRequest);
}
