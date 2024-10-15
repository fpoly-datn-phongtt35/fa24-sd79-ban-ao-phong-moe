package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sd79.model.CustomerAddress;

public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, Long> {
}
