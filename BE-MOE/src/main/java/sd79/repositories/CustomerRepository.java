package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sd79.model.Coupon;
import sd79.model.Customer;

import java.util.Date;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer> {

    @Query("SELECT c FROM Customer c WHERE (c.firstName LIKE %:firstName% OR c.lastName LIKE %:lastName% OR c.phoneNumber LIKE %:phoneNumber%)")
    List<Customer> findByNameOrPhone(@Param("firstName") String firstName, @Param("lastName") String lastName, @Param("phoneNumber") String phoneNumber);

}
