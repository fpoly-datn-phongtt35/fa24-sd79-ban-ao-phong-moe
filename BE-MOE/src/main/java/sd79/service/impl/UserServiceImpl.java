package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import sd79.exception.EntityNotFoundException;
import sd79.repositories.UserRepository;
import sd79.service.UserService;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDetailsService userDetailsService() {
        return username -> this.userRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException(String.format("User with username '%s' not found!", username))
        );
    }
}
