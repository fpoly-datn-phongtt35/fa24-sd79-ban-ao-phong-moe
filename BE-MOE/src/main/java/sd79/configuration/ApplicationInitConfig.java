/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.configuration;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import sd79.model.User;
import sd79.repositories.auth.RoleRepository;
import sd79.repositories.auth.UserRepository;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class ApplicationInitConfig {

    final PasswordEncoder passwordEncoder;

    final RoleRepository roleRepository;

    @Value("${spring.authentication.username}")
    String username;

    @Value("${spring.authentication.password}")
    String password;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        return args -> {
            User user = userRepository.findById(1L).orElse(null);
            assert user != null;
            user.setIsLocked(false);
            user.setIsEnabled(false);
            user.setIsDeleted(false);
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(this.roleRepository.findById(1).orElse(null));
            userRepository.save(user);
        };
    }
}
