package sd79.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import sd79.dto.response.CustomerResponse;
import sd79.model.Customer;
import sd79.model.CustomerAddress;
import sd79.repositories.CustomerAddressRepository;
import sd79.repositories.CustomerRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {

}
