/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service;

import io.jsonwebtoken.ExpiredJwtException;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import sd79.dto.requests.authRequests.ChangePassword;
import sd79.dto.requests.authRequests.SignInRequest;
import sd79.dto.requests.authRequests.SignUpRequest;
import sd79.dto.requests.authRequests.VerifyOtp;
import sd79.dto.requests.notifications.Recipient;
import sd79.dto.requests.notifications.SendEmailRequest;
import sd79.dto.response.auth.TokenResponse;
import sd79.exception.EntityNotFoundException;
import sd79.exception.InvalidDataException;
import sd79.model.Customer;
import sd79.model.CustomerAddress;
import sd79.model.User;
import sd79.model.redis_model.Token;
import sd79.repositories.CustomerAddressRepository;
import sd79.repositories.CustomerRepository;
import sd79.repositories.auth.RoleRepository;
import sd79.repositories.auth.UserRepository;
import sd79.utils.CloudinaryUtils;
import sd79.utils.RandomNumberGenerator;

import java.util.*;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static sd79.enums.TokenType.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final TokenService tokenService;

    private final PasswordEncoder passwordEncoder;

    private final RoleRepository roleRepository;

    private final CustomerRepository customerRepository;

    private final CustomerAddressRepository addressRepository;

    private final CloudinaryUtils cloudinary;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private final SpringTemplateEngine templateEngine;

    @Value("${spring.frontend.url}")
    private String host_frontend;

    public TokenResponse authenticate(SignInRequest signInRequest) {
        this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getUsername(), signInRequest.getPassword()));
        var user = this.userRepository.findUserByUsernameOrEmailIgnoreCase(signInRequest.getUsername())
                .filter(u -> u.getUsername().equals(signInRequest.getUsername()) || u.getEmail().equals(signInRequest.getUsername()))
                .orElseThrow(() -> new UsernameNotFoundException("Username or password incorrect"));

        String access_token = this.jwtService.generateToken(user);
        String refresh_token = this.jwtService.generateRefreshToken(user);

        this.tokenService.saveToken(Token.builder()
                .id(user.getUsername())
                .accessToken(access_token)
                .refreshToken(refresh_token)
                .build());
        return TokenResponse.builder()
                .accessToken(access_token)
                .refreshToken(refresh_token)
                .userId(user.getId())
                .authority(user.getRole().getName())
                .build();
    }

    public TokenResponse refresh(HttpServletRequest request) {
        String refresh_token = request.getHeader("AUTHORIZATION_REFRESH_TOKEN");
        if (StringUtils.isBlank(refresh_token)) {
            throw new InvalidDataException("Token must be not blank!");
        }
        final String username = this.jwtService.extractUsername(refresh_token, REFRESH_TOKEN);
        User user = this.userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        String access_token = this.jwtService.generateToken(user);
        this.tokenService.saveToken(Token.builder()
                .id(user.getUsername())
                .accessToken(access_token)
                .refreshToken(refresh_token)
                .build());
        return TokenResponse.builder()
                .accessToken(access_token)
                .refreshToken(refresh_token)
                .userId(user.getId())
                .build();
    }

    public void logout(HttpServletRequest request) {
        String authorization = request.getHeader(AUTHORIZATION);
        if (StringUtils.isBlank(authorization)) {
            throw new InvalidDataAccessApiUsageException("Token must be not blank!");
        }
        try {
            String username = this.jwtService.extractUsername(authorization, ACCESS_TOKEN);
            this.tokenService.deleteToken(username);
            log.info("========== logout successfully ==========");
        } catch (Exception e) {
            log.error("The account was logged out with an error={}", e.getMessage());
        }
    }

    public void validInfo(String email, String username) {
        Optional<User> byUsername = this.userRepository.findByUsername(username);
        Optional<User> byEmail = this.userRepository.findByEmail(email);
        if (byUsername.isPresent()) {
            throw new InvalidDataException("Username đã tồn tại!");
        }
        if (byEmail.isPresent()) {
            throw new InvalidDataException("Email đã tồn tại!");
        }
    }

    @Transactional
    public Long register(SignUpRequest request) {
        validInfo(request.getEmail(), request.getUsername());
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(this.passwordEncoder.encode(request.getPassword()))
                .role(this.roleRepository.findById(2).orElseThrow(() -> new EntityNotFoundException("Role not found")))
                .isLocked(false)
                .isEnabled(false)
                .createdAt(new Date())
                .updatedAt(new Date())
                .isDeleted(false)
                .build();
        var userSave = this.userRepository.save(user);
        var address = this.addressRepository.save(CustomerAddress.builder()
                .streetName(request.getStreetName())
                .ward(request.getWard())
                .district(request.getDistrict())
                .city(request.getCity())
                .districtId(request.getDistrictId())
                .cityId(request.getCityId())
                .build());
        Map<String, String> uploadResult = request.getAvatar() != null ? this.cloudinary.upload(request.getAvatar()) : null;
        Customer customer = Customer.builder()
                .phoneNumber(request.getPhoneNumber())
                .user(userSave)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(request.getGender().name())
                .dateOfBirth(request.getDateOfBirth())
                .createdAt(new Date())
                .updatedAt(new Date())
                .customerAddress(address)
                .image(request.getAvatar() != null ? Objects.requireNonNull(uploadResult).get("url") : null)
                .publicId(request.getAvatar() != null ? Objects.requireNonNull(uploadResult).get("publicId") : null)
                .build();
        this.customerRepository.save(customer);
        return userSave.getId();
    }

    public String getOtpVerifyRegister(String email) {
        String code = RandomNumberGenerator.generateEightDigitRandomNumber();
        Context context = new Context();
        Map<String, Object> properties = new HashMap<>();
        properties.put("otp", code);
        properties.put("url", host_frontend);
        context.setVariables(properties);
        String html = templateEngine.process("sent_otp.html", context);
        SendEmailRequest sendMail = SendEmailRequest.builder()
                .to(List.of(Recipient.builder()
                        .name("GUEST")
                        .email(email)
                        .build()))
                .subject("MOE SHOP - XÁC THỰC TÀI KHOẢN")
                .htmlContent(html)
                .build();
        kafkaTemplate.send("send-mail", sendMail);
        return jwtService.generateOtherToken(passwordEncoder.encode(code));
    }

    public void verifyOtp(VerifyOtp otp) {
        try {
            String extractOtp = jwtService.extractUsername(otp.getToken(), OTHER_TOKEN);
            if (!passwordEncoder.matches(otp.getOtp(), extractOtp)) {
                throw new InvalidDataException("Mã xác thực không hợp lệ");
            }
        } catch (ExpiredJwtException e) {
            throw new InvalidDataException("Mã không khả dụng!");
        }
    }

    public String requestForgotPassword(String email) {
        if (StringUtils.isBlank(email)) {
            throw new InvalidDataException("Email is blank!");
        }
        String code = RandomNumberGenerator.generateEightDigitRandomNumber();
        this.userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("Email không tồn tại"));
        Context context = new Context();
        Map<String, Object> properties = new HashMap<>();
        properties.put("otp", code);
        properties.put("url", host_frontend);
        context.setVariables(properties);
        String html = templateEngine.process("sent_otp.html", context);
        SendEmailRequest sendMail = SendEmailRequest.builder()
                .to(List.of(Recipient.builder()
                        .name("GUEST")
                        .email(email)
                        .build()))
                .subject("MOE SHOP - QUÊN MẬT KHẨU")
                .htmlContent(html)
                .build();
        kafkaTemplate.send("send-mail", sendMail);
        return jwtService.generateOtherToken(passwordEncoder.encode(code));
    }

    public void changePassword(ChangePassword req){
        User user = this.userRepository.findByEmail(req.getEmail()).orElseThrow(() -> new EntityNotFoundException("Email không tồn tại"));
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        this.userRepository.save(user);
    }
}
