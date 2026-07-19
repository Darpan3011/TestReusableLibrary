package com.test.demo.controller;

import com.darpan.security.model.CurrentUser;
import com.darpan.security.service.MfaService;
import com.darpan.security.service.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.darpan.security.utility.AuthData.resolveCurrentUser;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final MfaService mfaService;

    @PostMapping("/set-phone")
    public ResponseEntity<?> setPhoneNumber(@RequestBody SetPhoneRequest request, Authentication authentication) {
        CurrentUser currentUser = resolveCurrentUser(authentication);
        mfaService.setPhoneNumberByUsername(currentUser.username(), request.getPhoneNumber());
        return ResponseEntity.ok(Map.of("message", "Phone number set successfully. Verification code sent via SMS."));
    }

    @PostMapping("/verify-phone")
    public ResponseEntity<?> verifyPhoneNumber(@RequestBody VerifyPhoneRequest request, Authentication authentication) {
        CurrentUser currentUser = resolveCurrentUser(authentication);
        boolean verified = mfaService.verifyPhoneNumberByUsername(currentUser.username(), request.getCode());
        if (verified) {
            return ResponseEntity.ok(Map.of("message", "Phone number verified successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Verification failed"));
    }

    @GetMapping("/phone-status")
    public ResponseEntity<?> getPhoneStatus(Authentication authentication) {
        CurrentUser currentUser = resolveCurrentUser(authentication);
        PhoneStatusResponse response = mfaService.getPhoneStatusByUsername(currentUser.username());
        return ResponseEntity.ok(response);
    }
}
