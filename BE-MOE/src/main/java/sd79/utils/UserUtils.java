package sd79.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import sd79.exception.EntityNotFoundException;
import sd79.model.User;
import sd79.repositories.auth.UserRepository;

@Component
public class UserUtils {

    private  static UserRepository userRepository;

    @Autowired
    public UserUtils(UserRepository userRepository) {
        UserUtils.userRepository = userRepository;
    }

    public static User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
}
