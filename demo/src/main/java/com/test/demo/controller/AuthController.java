package com.test.demo.controller;

import com.darpan.security.model.CurrentUser;
import com.darpan.security.service.AuthService;
import com.darpan.security.service.MfaService;
import com.darpan.security.service.dto.*;
import com.darpan.security.service.enums.MfaCodeType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.darpan.security.utility.AuthData.resolveCurrentUser;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MfaService mfaService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest user) {
        var registeredUser = authService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "message", "User registered successfully. Please check your email for verification code.",
            "userId", registeredUser.getId()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        LoginResult result = authService.login(request);

        return switch (result.getStatus()) {
            case SUCCESS -> ResponseEntity.ok(result.getAuthResponse());
            case EMAIL_NOT_VERIFIED -> ResponseEntity.status(403).body(Map.of(
                "error", "EMAIL_NOT_VERIFIED",
                "message", "Please verify your email before logging in",
                "userId", result.getUserId()
            ));
            case MFA_REQUIRED -> ResponseEntity.status(202).body(result.getMfaResponse());
        };
    }

    @PostMapping("/send-mfa-code")
    public ResponseEntity<?> sendMfaCode(@RequestBody SendMfaCodeRequest request) {
        mfaService.generateAndSendCode(request.getUserId(), MfaCodeType.LOGIN, request.getMethod());
        return ResponseEntity.ok(Map.of("message", "Verification code sent via " + request.getMethod()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestParam("token") String refreshToken) {
        AuthResponse response = authService.refresh(refreshToken);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        CurrentUser user = resolveCurrentUser(authentication);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(user);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        authService.changePassword(req);
        return ResponseEntity.ok("Password updated");
    }

    @GetMapping("/auth-type")
    public ResponseEntity<Map<String, String>> authType() {
        return ResponseEntity.ok(Map.of("Auth Type", authService.getAuthType().name()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Password reset code sent to your email"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getEmail(), request.getCode(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password reset successfully. You can now login with your new password."));
    }
}
