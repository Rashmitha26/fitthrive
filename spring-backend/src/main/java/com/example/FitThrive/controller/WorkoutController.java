package com.example.FitThrive.controller;

import com.example.FitThrive.dto.WorkoutDTO;
import com.example.FitThrive.model.UserPrincipal;
import com.example.FitThrive.service.WorkoutService;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @PostMapping("/create-workout")
    public ResponseEntity<WorkoutDTO> addWorkout(@RequestBody WorkoutDTO workoutDTO) {
        WorkoutDTO createdWorkout = workoutService.addWorkoutDTO(workoutDTO);
        return new ResponseEntity<>(createdWorkout, HttpStatus.CREATED);
    }

    @PostMapping("/test")
    public ResponseEntity<WorkoutDTO> test(@RequestBody WorkoutDTO workoutDTO) {
        WorkoutDTO newOne = workoutService.test(workoutDTO);
        return new ResponseEntity<>(newOne, HttpStatus.CREATED);
    }

    @GetMapping("/workout/{id}")
    public ResponseEntity<WorkoutDTO> getWorkout(@PathVariable long id) {
        WorkoutDTO workoutDTO = workoutService.getWorkoutDTO(id);
        return workoutDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(workoutDTO, HttpStatus.OK);
    }

    @PutMapping("/edit-workout")
    public ResponseEntity<WorkoutDTO> updateWorkout(@RequestBody WorkoutDTO workoutDTO) {
        WorkoutDTO updatedWorkoutDTO = workoutService.updateWorkout(workoutDTO);
        return updatedWorkoutDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(updatedWorkoutDTO, HttpStatus.OK);
    }

    @DeleteMapping("/delete-workout/{id}")
    public ResponseEntity<WorkoutDTO> deleteWorkout(@PathVariable long id) {
        return workoutService.deleteWorkout(id) ? new ResponseEntity<WorkoutDTO>(HttpStatus.NO_CONTENT) : new ResponseEntity<WorkoutDTO>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/search-workout")
    public ResponseEntity<List<WorkoutDTO>> searchWorkouts(@RequestParam(value = "search", required = false) String keyword, @RequestParam(value = "excludeIds", required = false) List<Long> excludeIds, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return new ResponseEntity<>(workoutService.searchWorkouts(keyword, excludeIds, userPrincipal.getUser().getId()), HttpStatus.OK);
    }

    @GetMapping("/workouts")
    public ResponseEntity<List<WorkoutDTO>> getWorkouts() {
        return new ResponseEntity<>(workoutService.getWorkouts(), HttpStatus.OK);
    }

    @PostMapping("/workouts-by-id")
    public List<WorkoutDTO> getWorkoutsById(@RequestBody List<String> ids) {
        return workoutService.getWorkoutsById(ids);
    }

    @GetMapping("/workout-trainer-info/{id}")
    public ResponseEntity<Map<String, Object>> getWorkoutWithTrainerInfo(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String currentUserName = userPrincipal.getUsername();
        Map<String, Object> response = workoutService.getWorkoutAndTrainerInfo(id, currentUserName);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/workouts-by-trainer/{id}")
    public ResponseEntity<List<WorkoutDTO>> getWorkoutsCreatedByUser(@PathVariable Long id) {
        List<WorkoutDTO> workouts = workoutService.getWorkoutsByTrainer(id);
        return workouts == null ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(workouts, HttpStatus.OK);
    }

    @GetMapping("/workouts-in-pages")
    public ResponseEntity<Page<WorkoutDTO>> getWorkoutInPages(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size) {
        Page<WorkoutDTO> result = workoutService.getWorkoutsInPages(page, size);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/search-workout-in-pages")
    public ResponseEntity<Page<WorkoutDTO>> searchWorkouts(@RequestParam(value = "search", required = false) String keyword, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size) {
        return new ResponseEntity<>(workoutService.searchWorkoutsInPages(keyword, page, size), HttpStatus.OK);
    }

    @GetMapping("/search-workout-to-add")
    public ResponseEntity<Page<WorkoutDTO>> searchWorkouts(@RequestParam(value = "search", required = false) String keyword, @RequestParam(value = "excludeIds", required = false) List<Long> excludeIds, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return new ResponseEntity<>(workoutService.searchWorkoutsToAdd(keyword, excludeIds, page, size, userPrincipal.getUser().getId()), HttpStatus.OK);
    }
}
