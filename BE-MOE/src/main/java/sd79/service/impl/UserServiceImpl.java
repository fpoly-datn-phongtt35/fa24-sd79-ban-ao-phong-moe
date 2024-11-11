/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sd79.exception.EntityNotFoundException;
import sd79.model.User;
import sd79.repositories.auth.UserRepository;
import sd79.service.UserService;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@Lazy
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDetailsService userDetailsService() {
        return username -> this.userRepository.findUserByUsernameOrEmailIgnoreCase(username)
                .filter(user -> user.getUsername().equals(username) || user.getEmail().equals(username))
                .orElseThrow(() -> new EntityNotFoundException(String.format("User with username '%s' not found!", username)));

    }

//    @Override
//    public void updatePassword(String oldPassword, String newPassword) {
//        try {
//            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
//            Optional<User> userOpt = userRepository.findByUsernameAndEmail(currentUsername, currentUsername);
//
//            if (userOpt.isEmpty()) {
//                throw new EntityNotFoundException("Không tìm thấy người dùng");
//            }
//
//            User user = userOpt.get();
//
//            // Kiểm tra mật khẩu cũ có khớp với mật khẩu được lưu không
//            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
//                throw new IllegalArgumentException("Mật khẩu cũ không đúng");
//            }
//
//            // Ngăn không cho đặt mật khẩu mới trùng với mật khẩu cũ
//            if (passwordEncoder.matches(newPassword, user.getPassword())) {
//                throw new IllegalArgumentException("Mật khẩu mới phải khác mật khẩu cũ");
//            }
//
//            // Mã hóa và cập nhật mật khẩu mới
//            user.setPassword(passwordEncoder.encode(newPassword));
//            userRepository.save(user);
//        } catch (Exception e) {
//            throw new RuntimeException("Không thể cập nhật mật khẩu: " + e.getMessage());
//        }
//    }

}
