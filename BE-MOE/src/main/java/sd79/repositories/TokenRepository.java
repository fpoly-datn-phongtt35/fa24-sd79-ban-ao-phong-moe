package sd79.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import sd79.model.redis_model.Token;

@Repository
public interface TokenRepository extends CrudRepository<Token, String> {
}