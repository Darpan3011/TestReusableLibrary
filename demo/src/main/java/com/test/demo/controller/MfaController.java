package com.test.demo.controller;

import com.darpan.security.service.MfaService;
import com.darpan.security.service.dto.*;
import com.darpan.security.service.enums.MfaCodeType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class MfaController {

    private final MfaService mfaService;

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody VerifyCodeRequest request) {
        mfaService.verifyEmailAndActivate(request.getUserId(), request.getCode());
        return ResponseEntity.ok(Map.of("message", "Email verified successfully. You can now log in."));
    }

    @PostMapping("/verify-mfa")
    public ResponseEntity<?> verifyMfa(@RequestBody VerifyCodeRequest request) {
        AuthResponse authResponse = mfaService.verifyMfaAndGenerateTokens(request.getUserId(), request.getCode());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/resend-code")
    public ResponseEntity<?> resendCode(@RequestBody ResendCodeRequest request) {
        mfaService.resendCode(request.getUserId(), request.getType());
        return ResponseEntity.ok(Map.of("message", "Code sent successfully"));
    }

    @PostMapping("/toggle-mfa")
    public ResponseEntity<?> toggleMfa(@RequestBody ToggleMfaRequest request, Authentication authentication) {
        String username = authentication.getName();
        mfaService.toggleMfaForUser(username, request.isEnabled());
        return ResponseEntity.ok(Map.of(
            "mfaEnabled", request.isEnabled(),
            "message", "MFA " + (request.isEnabled() ? "enabled" : "disabled") + " successfully"
        ));
    }
}
