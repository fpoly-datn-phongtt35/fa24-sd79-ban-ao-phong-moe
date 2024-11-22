/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
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
import sd79.model.Customer;
import sd79.model.Employee;
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
        if (role.equals(UserRole.ADMIN)) {
            String queryAdmin = "FROM employees  u WHERE u.user.username = :username";
            TypedQuery<Employee> query = entityManager.createQuery(queryAdmin, Employee.class);
            query.setParameter("username", username);
            Employee result = query.getSingleResult();
            return UserResponse.builder()
                    .username(result.getUser().getUsername())
                    .fullName(String.format("%s %s", result.getLast_name(), result.getFirst_name()))
                    .email(result.getUser().getEmail())
                    .avatar(result.getImage())
                    .isManager(result.getPosition().getId() == 1) // 1 is manager
                    .build();
        } else {
            String queryUser = "FROM Customer u WHERE u.user.username = :username";

            TypedQuery<Customer> query = entityManager.createQuery(queryUser, Customer.class);
            query.setParameter("username", username);
            Customer result = query.getSingleResult();
            return UserResponse.builder()
                    .username(result.getUser().getUsername())
                    .fullName(String.format("%s %s", result.getLastName(), result.getFirstName()))
                    .email(result.getUser().getEmail())
                    .avatar(result.getImage())
                    .build();
        }
    }
}
