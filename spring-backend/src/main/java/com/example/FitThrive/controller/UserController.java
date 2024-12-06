package com.example.FitThrive.controller;

import com.example.FitThrive.dto.UserDTO;
import com.example.FitThrive.dto.WorkoutProgramDTO;
import com.example.FitThrive.model.User;
import com.example.FitThrive.model.UserPrincipal;
import com.example.FitThrive.service.JwtService;
import com.example.FitThrive.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("register")
    public ResponseEntity<?> addUser(@RequestBody User user) {
        try {
            UserDTO userDTO = userService.getUserDTOForName(user.getName());
            if (userDTO != null) {
                return new ResponseEntity<>("User with this username already exists", HttpStatus.CONFLICT);
            }
            User createdUser = userService.createUser(user);
            String username = createdUser.getUsername();

            String token = jwtService.generateToken(username);
            String refreshToken = jwtService.createRefreshToken(username);

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("refreshToken", refreshToken);

            Map<String, String> userDetails = new HashMap<>();
            userDetails.put("name", createdUser.getName());
            userDetails.put("id", createdUser.getId() + "");
            userDetails.put("email", createdUser.getEmail());
            userDetails.put("username", username);
            response.put("user_details", new ObjectMapper().writeValueAsString(userDetails));
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing user details");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
        }
    }

    @GetMapping("user-id/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable long id) {
        UserDTO userDTO = userService.getUserDTO(id);
        return userDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping("user")
    public ResponseEntity<UserDTO> getUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserDTO userDTO = userService.getUserDTO(userPrincipal.getUser().getId());
        return userDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping("username/{name}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String name) {
        UserDTO userDTO = userService.getUserDTOForName(name);
        return userDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @PutMapping("/user")
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO userDTO) {
        UserDTO updatedUserDTO = userService.updateUser(userDTO);
        return updatedUserDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(updatedUserDTO, HttpStatus.OK);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable long id) {
        return userService.deleteUser(id) ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/enroll-workout/{workoutId}")
    public ResponseEntity<UserDTO> enrollUserInWorkout(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable long workoutId) {
        UserDTO userDTO = userService.enrollUserInWorkoutProgram(userPrincipal.getUser().getId(), workoutId);
        return userDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(userDTO, HttpStatus.CREATED);
    }

    @GetMapping("/user-workout-program")
    public ResponseEntity<Set<WorkoutProgramDTO>> getUserWorkoutProgram(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Set<WorkoutProgramDTO> enrolledWorkoutPrograms = userService.getUserWorkoutPrograms(userPrincipal.getUser().getId());
        return enrolledWorkoutPrograms == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(enrolledWorkoutPrograms, HttpStatus.OK);
    }


    @GetMapping("is-user-enrolled/{userId}/program/{programId}")
    public ResponseEntity<Boolean> isUserEnrolledInProgram(@PathVariable long userId, @PathVariable long programId) {
        return userService.isUserEnrolledInProgram(userId, programId) ? new ResponseEntity<>(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
