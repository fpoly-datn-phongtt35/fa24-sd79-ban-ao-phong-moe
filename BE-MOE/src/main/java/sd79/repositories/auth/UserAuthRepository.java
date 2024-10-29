package sd79.repositories.auth;

import io.micrometer.common.util.StringUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.stereotype.Component;
import sd79.dto.response.auth.UserResponse;
import sd79.enums.UserRole;
import sd79.service.JwtService;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static sd79.enums.TokenType.ACCESS_TOKEN;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserAuthRepository {
    @PersistenceContext
    private EntityManager entityManager;

    private final JwtService jwtService;

    public UserResponse getUser(HttpServletRequest request, UserRole role) {
        String authorization = request.getHeader(AUTHORIZATION);
        if (StringUtils.isBlank(authorization)) {
            throw new InvalidDataAccessApiUsageException("Token must be not blank!");
        }
        final String token = authorization.substring("Bearer ".length());
        final String username = this.jwtService.extractUsername(token, ACCESS_TOKEN);
        StringBuilder sql = new StringBuilder("SELECT new sd79.dto.response.auth.UserResponse(u.user.username, u.user.email, u.image)");
        if (role.equals(UserRole.ADMIN)) {
            //TODO
            sql.append(" FROM Employee u WHERE u.user.username = :username");
            TypedQuery<UserResponse> query = entityManager.createQuery(sql.toString(), UserResponse.class);
            query.setParameter("username", username);
            return query.getSingleResult();
        } else {
            sql.append(" FROM Customer u WHERE u.user.username = :username");
            TypedQuery<UserResponse> query = entityManager.createQuery(sql.toString(), UserResponse.class);
            query.setParameter("username", username);
            return query.getSingleResult();
        }
    }
}
