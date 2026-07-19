package com.test.demo.controller;

import com.darpan.communication.model.EmailRequest;
import com.darpan.communication.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/email/test")
@RequiredArgsConstructor
@Slf4j
public class EmailController {

    private final EmailService emailService;

    @Value("${messaging.mail.username}")
    public String from;

    // ------------------------
    // Queue email asynchronously (no attachments)
    // ------------------------
    @PostMapping("/simple")
    public ResponseEntity<String> sendSimpleEmail(@RequestBody EmailRequest request) {
        try {
            emailService.sendEmailAsync(request.getTo(), request.getSubject(), request.getBody(), from, request.getTitle(), null);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Email queued");
        } catch (Exception e) {
            log.error("sendSimpleEmail failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to queue email: " + e.getMessage());
        }
    }

    // ------------------------
    // Send email synchronously (blocks until send completes)
    // ------------------------
    @PostMapping("/send-sync")
    public ResponseEntity<String> sendSyncEmail(@RequestBody EmailRequest request) {
        try {
            emailService.sendEmail(request.getTo(), request.getSubject(), request.getBody(), from, request.getTitle(), null);
            return ResponseEntity.ok("Email sent (sync)");
        } catch (Exception e) {
            log.error("sendSyncEmail failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email: " + e.getMessage());
        }
    }

    // ------------------------
    // Send with filesystem file paths (request.files should contain absolute/relative paths)
    // ------------------------
    @PostMapping("/file-path")
    public ResponseEntity<String> sendEmailWithFilePaths(@RequestBody EmailRequest request) {
        List<String> files = request.getFiles();
        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body("No file paths provided!");
        }
        try {
            emailService.sendEmailWithMultipleFiles(request.getTo(), request.getSubject(), request.getBody(), request.getTitle(), from, files);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Email queued with file(s) from file system");
        } catch (Exception e) {
            log.error("sendEmailWithFilePaths failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to queue email: " + e.getMessage());
        }
    }

    // ------------------------
    // Send with classpath files (request.files are classpath locations)
    // ------------------------
    @PostMapping("/classpath")
    public ResponseEntity<String> sendEmailWithClasspathFiles(@RequestBody EmailRequest request) {
        List<String> files = request.getFiles();
        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body("No classpath files provided!");
        }
        try {
            emailService.sendEmailWithClasspathFiles(request.getTo(), request.getSubject(), request.getBody(), request.getTitle(), files);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Email queued with classpath file(s)");
        } catch (Exception e) {
            log.error("sendEmailWithClasspathFiles failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to queue email: " + e.getMessage());
        }
    }

    // ------------------------
    // Send with an uploaded multipart file
    // ------------------------
    @PostMapping(value = "/multipart", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> sendEmailWithMultipart(@RequestParam("to") String to, @RequestParam("subject") String subject, @RequestParam("body") String body, @RequestParam("title") String title, @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            emailService.sendEmailWithMultipartFile(to, subject, body, from, title, file);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Email queued with uploaded file");
        } catch (Exception e) {
            log.error("sendEmailWithMultipart failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to queue email: " + e.getMessage());
        }
    }

    @PostMapping("/multipart/multiple")
    public ResponseEntity<?> sendEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String body,
            @RequestParam String title,
            @RequestParam(name = "files", required = false) List<MultipartFile> files) {

            emailService.sendEmailWithMultipartFiles(to, subject, body, from, title, files);
            return ResponseEntity.ok("Email queued");
    }

}
