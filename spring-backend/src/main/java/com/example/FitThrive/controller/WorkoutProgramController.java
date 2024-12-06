package com.example.FitThrive.controller;

import com.example.FitThrive.dto.WorkoutDTO;
import com.example.FitThrive.dto.WorkoutProgramDTO;
import com.example.FitThrive.dto.WorkoutProgramM2MDTO;
import com.example.FitThrive.model.UserPrincipal;
import com.example.FitThrive.model.WorkoutProgram;
import com.example.FitThrive.service.WorkoutProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class WorkoutProgramController {
    @Autowired
    WorkoutProgramService workoutProgramService;

    @PostMapping("/create-workout-program")
    public ResponseEntity<WorkoutProgramDTO> createWorkoutProgram(@RequestBody WorkoutProgramDTO workoutProgramDTO) {
        WorkoutProgramDTO createdWorkoutProgramDTO =  workoutProgramService.addWorkoutProgram(workoutProgramDTO);
        return new ResponseEntity<>(createdWorkoutProgramDTO, HttpStatus.CREATED);
    }

    @GetMapping("/workout-program/{id}")
    public ResponseEntity<WorkoutProgramDTO> getWorkoutProgram(@PathVariable long id) {
        WorkoutProgramDTO workoutProgramDTO =  workoutProgramService.getWorkoutProgramDTO(id);
        return workoutProgramDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(workoutProgramDTO, HttpStatus.OK);
    }

    @PutMapping("/edit-workout-program")
    public ResponseEntity<WorkoutProgramDTO> editWorkoutProgram(@RequestBody WorkoutProgramDTO workoutProgramDTO) {
        WorkoutProgramDTO updatedWorkoutProgramDTO = workoutProgramService.editWorkoutProgram(workoutProgramDTO);
        return updatedWorkoutProgramDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(updatedWorkoutProgramDTO, HttpStatus.OK);
    }

    @DeleteMapping("/delete-workout-program/{id}")
    public ResponseEntity<WorkoutProgram> deleteWorkoutProgram(@PathVariable long id) {
        return workoutProgramService.deleteWorkoutProgram(id) ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/add-workout-to-program")
    public void addWorkoutToProgram(@RequestBody WorkoutProgramM2MDTO workoutProgramM2MDTO) {
        workoutProgramService.addWorkoutToProgram(workoutProgramM2MDTO);
    }

    @GetMapping("/workout-programs")
    public List<WorkoutProgramDTO> getWorkoutPrograms() {
        return workoutProgramService.getWorkoutPrograms();
    }

    @GetMapping("/workout-program-trainer-info/{id}")
    public ResponseEntity<Map<String, Object>> getWorkoutProgramWithTrainerInfo(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String currentUserName = userPrincipal.getUsername();
        Map<String, Object> response = workoutProgramService.getWorkoutProgramAndTrainerInfo(id, currentUserName);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/workout-programs-by-trainer/{id}")
    public ResponseEntity<List<WorkoutProgramDTO>> getWorkoutsByTrainer(@PathVariable Long id) {
        List<WorkoutProgramDTO> workoutProgramDTOs= workoutProgramService.getWorkoutProgramsByUser(id);
        return ResponseEntity.ok(workoutProgramDTOs);
    }

    @GetMapping("/workout-program-workouts/{id}")
    public ResponseEntity<List<WorkoutDTO>> getProgramWorkouts(@PathVariable long id) {
        List<WorkoutDTO> workouts = workoutProgramService.getWorkoutDTOs(id);
        return workouts == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(workouts, HttpStatus.OK);
    }

    @PutMapping("/set-workouts/{id}")
    public ResponseEntity<List<WorkoutDTO>> setWorkouts(@PathVariable long id, @RequestBody List<WorkoutDTO> workoutDTOS) {
        List<WorkoutDTO> updatedWorkouts = workoutProgramService.setWorkouts(id, workoutDTOS);
        return updatedWorkouts == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(updatedWorkouts, HttpStatus.OK);
    }

    @GetMapping("/workout-programs-in-pages")
    public ResponseEntity<Page<WorkoutProgramDTO>> getWorkoutProgramsInPages(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size) {
        Page<WorkoutProgramDTO> result = workoutProgramService.getWorkoutProgramsInPages(page, size);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/search-workout-programs-in-pages")
    public ResponseEntity<Page<WorkoutProgramDTO>> searchWorkoutProgramsInPages(@RequestParam(value = "search", required = false) String keyword, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size) {
        return new ResponseEntity<>(workoutProgramService.searchWorkoutProgramsInPages(keyword, page, size), HttpStatus.OK);
    }

    @GetMapping("/recent-workout-programs-in-pages")
    public ResponseEntity<Page<WorkoutProgramDTO>> recentWorkoutProgramsInPages(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size) {
        return new ResponseEntity<>(workoutProgramService.recentWorkoutProgramsInPages(page, size), HttpStatus.OK);
    }
}
