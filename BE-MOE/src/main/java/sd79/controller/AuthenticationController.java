/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import sd79.dto.requests.authRequests.ChangePassword;
import sd79.dto.requests.authRequests.SignInRequest;
import sd79.dto.requests.authRequests.SignUpRequest;
import sd79.dto.requests.authRequests.VerifyOtp;
import sd79.dto.response.ResponseData;
import sd79.dto.response.auth.TokenResponse;
import sd79.enums.UserRole;
import sd79.repositories.auth.UserAuthRepository;
import sd79.service.AuthenticationService;

@Slf4j
@RestController
@RequestMapping("/api/${api.version}/auth")
@Tag(name = "Authentication Controller", description = "Handles authentication-related operations such as login, logout, and token management.")
@RequiredArgsConstructor
@Validated
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final UserAuthRepository userAuthRepository;

    /**
     * @param request {'username': 'your_username', 'password': 'your_password', 'platform': 'WEB|ANDROID|IOS', 'deviceToken': 'your_deviceToken', 'version': 'your_version'}
     */
    @Operation(summary = "Access token", description = "Enter a valid username and password to generate the access_token and refresh_token used to log in")
    @PostMapping("/access")
    public ResponseEntity<TokenResponse> access(@Valid @RequestBody SignInRequest request) {
        return ResponseEntity.ok(this.authenticationService.authenticate(request));
    }

    /**
     * @param request Header: Authorization
     */
    @Operation(
            summary = "Refresh Access Token",
            description = "Accepts a refresh_token and generates a new access_token."
    )
    @PostMapping("/refresh")
    public ResponseData<?> refresh(HttpServletRequest request) {
        log.info("Request refresh token");
        return new ResponseData<>(HttpStatus.OK.value(), "Success", authenticationService.refresh(request));
    }

    /**
     * @param request Header: Authorization
     */
    @Operation(
            summary = "Logout and Remove Token",
            description = "Accepts a refresh_token and removes the associated access_token from the database, effectively logging out the user."
    )
    @PostMapping("/remove")
    public ResponseData<?> logout(HttpServletRequest request) {
        log.info("Request remove token");
        authenticationService.logout(request);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Success");
    }

    /**
     * @param request Header: Authorization
     */
    @Operation(
            summary = "Get User",
            description = "Find user for get info to display data."
    )
    @GetMapping("/user")
    public ResponseData<?> getUser(HttpServletRequest request, UserRole role) {
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Success", this.userAuthRepository.getUser(request, role));
    }

    @Operation(
            summary = "Register User",
            description = "Register a new user with the provided details."
    )
    @PostMapping("/register")
    public ResponseData<?> register(@Valid @ModelAttribute SignUpRequest request) {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", this.authenticationService.register(request));
    }

    @Operation(
            summary = "Validate User Information",
            description = "Check if the provided email and username are valid and not taken.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Validation successful",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ResponseData.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid input parameters",
                            content = @Content
                    )
            }
    )
    @GetMapping("/valid-info/{email}/{username}")
    public ResponseData<?> validInfo(@PathVariable String email, @PathVariable String username) {
        this.authenticationService.validInfo(email, username);
        return new ResponseData<>(HttpStatus.OK.value(), "Data is valid");
    }

    @Operation(
            summary = "Send OTP",
            description = "Send a one-time password to the specified email for verification purposes.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "OTP sent successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ResponseData.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid email format",
                            content = @Content
                    )
            }
    )
    @PostMapping("/sent-otp/{email}")
    public ResponseData<?> sentOtp(
            @Parameter(description = "Email to send OTP", required = true) @PathVariable String email) {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", authenticationService.getOtpVerifyRegister(email));
    }

    @Operation(
            summary = "Verify OTP",
            description = "Verify the provided one-time password.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "OTP verified successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ResponseData.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid OTP",
                            content = @Content
                    )
            }
    )
    @PostMapping("/verify-otp")
    public ResponseData<?> verifyOtp(@RequestBody VerifyOtp otp) {
        authenticationService.verifyOtp(otp);
        return new ResponseData<>(HttpStatus.OK.value(), "Success");
    }

    @Operation(
            summary = "Forgot Password",
            description = "Request a password reset for the specified email. An email with reset instructions will be sent.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Password reset request successful",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ResponseData.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid email format or user not found",
                            content = @Content
                    )
            }
    )
    @GetMapping("/forgot-password/{email}")
    public ResponseData<?> forgotPassword(@PathVariable String email) {
        return new ResponseData<>(HttpStatus.OK.value(), "Success", authenticationService.requestForgotPassword(email));
    }

    @Operation(
            summary = "Change Password",
            description = "Update the user's password. Requires a valid reset token or current password for verification.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Password changed successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ResponseData.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid token, password mismatch, or weak password",
                            content = @Content
                    )
            }
    )
    @PostMapping("/change-password")
    public ResponseData<?> changePassword(@RequestBody ChangePassword req) {
        this.authenticationService.changePassword(req);
        return new ResponseData<>(HttpStatus.OK.value(), "Success");
    }
}
