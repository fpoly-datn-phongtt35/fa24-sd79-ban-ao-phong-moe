package sd79.repositories.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sd79.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
}
