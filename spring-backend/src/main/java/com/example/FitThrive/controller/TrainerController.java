package com.example.FitThrive.controller;

import com.example.FitThrive.dto.TrainerDTO;
import com.example.FitThrive.model.UserPrincipal;
import com.example.FitThrive.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TrainerController {

    @Autowired
    TrainerService trainerService;

    @PostMapping("/trainer")
    public ResponseEntity<TrainerDTO> addTrainer(@RequestBody TrainerDTO trainerDTO) {
        TrainerDTO createdTrainerDTO = trainerService.addTrainerDTO(trainerDTO);
        return createdTrainerDTO == null ? new ResponseEntity<>(HttpStatus.BAD_REQUEST) :new ResponseEntity<>(createdTrainerDTO, HttpStatus.CREATED);
    }

    @GetMapping("/trainer/{id}")
    public ResponseEntity<TrainerDTO> getTrainer(@PathVariable long id) {
        TrainerDTO trainerDTO = trainerService.getTrainerDTO(id);
        return trainerDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(trainerDTO, HttpStatus.OK);
    }

    @GetMapping("/get-trainer")
    public ResponseEntity<Long> getTrainerIdByUserId(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (!userPrincipal.isTrainer()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        Long trainerId = trainerService.getTrainerDTOByUserId(userPrincipal.getUser().getId());
        return trainerId == null ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(trainerId, HttpStatus.OK);
    }

    @PutMapping("/trainer")
    public ResponseEntity<TrainerDTO> updateTrainer(@RequestBody TrainerDTO trainerDTO) {
        TrainerDTO updatedTrainerDTO = trainerService.updateTrainer(trainerDTO);
        return updatedTrainerDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(updatedTrainerDTO, HttpStatus.OK);
    }

    @DeleteMapping("/trainer/{id}")
    public ResponseEntity<TrainerDTO> deleteTrainer(@PathVariable long id) {
        return trainerService.deleteTrainer(id) ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
