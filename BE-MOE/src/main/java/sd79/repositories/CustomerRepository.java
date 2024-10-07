package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer> {
}
