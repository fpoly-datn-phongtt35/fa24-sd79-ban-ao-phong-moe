package sd79.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sd79.model.Support;

import java.util.List;

public interface SupportRepository extends JpaRepository<Support, Long> {
    List<Support> findByStatus(String status);
}
