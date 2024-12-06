package com.example.FitThrive.config;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseBody
    public ResponseEntity<?> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        String field = "unknown";
        String message = "An error occurred while processing your request.";

        // Check for unique constraint violation
        if (ex.getCause() != null && ex.getCause().getCause() != null) {
            String causeMessage = ex.getCause().getCause().getMessage();
            if (causeMessage.contains("duplicate key value violates unique constraint")) {
                if (causeMessage.contains("users_email_key")) {
                    field = "email";
                    message = "Email address already in use.";
                } else if (causeMessage.contains("users_username_key")) {
                    field = "username";
                    message = "Username already in use.";
                } else if (causeMessage.contains("trainer_user_id_key")) {
                    field = "user_id";
                    message = "Trainer profile already exists for this user.";
                } else if (causeMessage.contains("workout_name_key")) {
                    field = "name";
                    message = "Workout with this name already exists";
                } else if (causeMessage.contains("workout_program_name_key")) {
                    field = "name";
                    message = "Workout Program with this name already exists";
                }
            }
        }

        errorResponse.put("field", field);
        errorResponse.put("message", message);

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}
