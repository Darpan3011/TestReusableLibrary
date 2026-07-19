package com.test.demo.globalexception;

import com.darpan.communication.exception.FileUploadSizeException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.io.Serializable;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleEntityNotFoundException(DataIntegrityViolationException ex) {
        // You can return a custom error response body here
        ApiError apiError = new ApiError(HttpStatus.NOT_FOUND, ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<ApiError> handleAuthenticationException(AuthenticationException ex) {
        ApiError apiError = new ApiError(HttpStatus.UNAUTHORIZED, "Authentication failed: " + ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<ApiError> handleAccessDeniedException(AccessDeniedException ex) {
        ApiError apiError = new ApiError(HttpStatus.FORBIDDEN, "Access Denied: " + ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(FileUploadSizeException.class)
    @ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
    public ResponseEntity<ApiError> handleFileSizeLimitExceeded(FileUploadSizeException ex) {
        ApiError apiError = new ApiError(HttpStatus.PAYLOAD_TOO_LARGE, ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @Value("${spring.servlet.multipart.max-file-size:10MB}")
    private String maxFileSize;

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
    public ResponseEntity<ApiError> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException ex) {
        String message = "File size exceeds the maximum allowed limit of " + maxFileSize;
        ApiError apiError = new ApiError(HttpStatus.PAYLOAD_TOO_LARGE, message);
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(com.ratelimiter.exception.RateLimitExceededException.class)
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public ResponseEntity<ApiError> handleRateLimitExceeded(com.ratelimiter.exception.RateLimitExceededException ex) {
        ApiError apiError = new ApiError(HttpStatus.TOO_MANY_REQUESTS, "Too Many Requests: " + ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiError> handleRuntimeException(RuntimeException ex) {
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiError> handleIllegalArgumentException(IllegalArgumentException ex) {
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, "Invalid argument: " + ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(Exception ex) {
        // You can return a custom error response body here
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    // A simple custom error response object for better output
    public static class ApiError implements Serializable {
        private HttpStatus status;
        private String message;

        public ApiError(HttpStatus status, String message) {
            this.status = status;
            this.message = message;
        }
        // Add getters for status and message
        public HttpStatus getStatus() { return status; }
        public String getMessage() { return message; }
    }

}
