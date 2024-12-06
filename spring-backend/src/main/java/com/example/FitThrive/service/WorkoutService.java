package com.example.FitThrive.service;

import com.example.FitThrive.dto.WorkoutDTO;
import com.example.FitThrive.model.Trainer;
import com.example.FitThrive.model.Workout;
import com.example.FitThrive.repo.WorkoutRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    @Autowired
    private TrainerService trainerService;

    @Autowired
    private WorkoutRepo workoutRepo;

    public Workout addWorkout(Workout workout) {
        if (workout == null) {
            return null;
        }

        if (workout.getTrainer() == null) {
            throw new RuntimeException("Invalid trainer id: " + workout.getTrainer().getId());
        }
        return workoutRepo.save(workout);
    }

    public WorkoutDTO addWorkoutDTO(WorkoutDTO workoutDTO) {
        String currentUserName = SecurityContextHolder.getContext().getAuthentication().getName();
        Trainer trainer = trainerService.getTrainerByUserName(currentUserName);
        if (trainer == null) {
            throw new RuntimeException("Invalid trainer id: " + workoutDTO.getTrainer_id());
        }

        workoutDTO.setTrainerId(trainer.getId());
        workoutDTO.setTrainerName(currentUserName);
        Workout workout = createEntityFromDTO(workoutDTO, true);
        workoutRepo.save(workout);
        return createDTOFromEntity(workout);
    }

    public Workout getWorkout(long id) {
        return workoutRepo.findById(id).orElse(null);
    }

    public WorkoutDTO getWorkoutDTO(long id) {
        Workout workout = workoutRepo.findById(id)
                .orElse(null);
        if (workout == null) {
            return null;
        }
        WorkoutDTO workoutDTO = createDTOFromEntity(workout);
        return workoutDTO;
    }

    public WorkoutDTO updateWorkout(WorkoutDTO workoutDTO) {
        Workout workout = createEntityFromDTO(workoutDTO, false);
        String currentUserName = SecurityContextHolder.getContext().getAuthentication().getName();
        if (workout == null || !workout.getTrainer().getUser().getUsername().equals(currentUserName)) {
            return null;
        }
        workoutRepo.save(workout);
        return getWorkoutDTO(workoutDTO.getId());
    }

    public boolean deleteWorkout(long id) {
        if (workoutRepo.existsById(id)) {
            Workout workout = workoutRepo.findById(id).orElse(null);
            String currentUserName = SecurityContextHolder.getContext().getAuthentication().getName();
            if (workout == null || !workout.getTrainer().getUser().getUsername().equals(currentUserName)) {
                return false;
            }
            workoutRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean isLoggedInUserTrainer(long userId) {
        return trainerService.getTrainerDTOByUserId(userId) != null;
    }

    public Workout createEntityFromDTO(WorkoutDTO workoutDTO, boolean shouldCreate) {
        Workout workout;

        if (!shouldCreate) {
            workout = workoutRepo.findById(workoutDTO.getId()).orElse(null);
            if (workout == null) {
                return null;
            }
        } else {
            workout = new Workout();
        }

        Trainer trainer = trainerService.getTrainer(workoutDTO.getTrainer_id());
        if (trainer == null) {
            return null;
        }

        workout.setName(workoutDTO.getName());
        workout.setDescription(workoutDTO.getDescription());
        if (shouldCreate) {
            workout.setTrainer(trainer);
        }
        workout.setDuration(workoutDTO.getDuration());
        workout.setUrl(workoutDTO.getUrl());
        return workout;
    }

    public Page<WorkoutDTO> getWorkoutsInPages(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Workout> workoutPage = workoutRepo.findAll(pageRequest);
        return workoutPage.map(this::createDTOFromEntity);
    }

    public List<WorkoutDTO> getWorkouts() {
        List<Workout> workouts = workoutRepo.findAll();
        return workouts.stream().map(this::createDTOFromEntity).collect(Collectors.toList());
    }

    public WorkoutDTO createDTOFromEntity(Workout workout) {
        WorkoutDTO workoutDTO = new WorkoutDTO(workout);
        return workoutDTO;
    }

    public List<WorkoutDTO> searchWorkouts(String keyword, List<Long> excludeIds, Long userId) {
        if (keyword == null || keyword.isEmpty()) {
            return null;
        }
        List<WorkoutDTO> workoutDTOs = new ArrayList<>();
        List<Workout> workouts = workoutRepo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
        for(Workout workout: workouts) {
           if (workout != null && workout.getTrainer().getUser().getId() == userId && !excludeIds.contains(workout.getId())) {
               workoutDTOs.add(createDTOFromEntity(workout));
           }
        }
        return workoutDTOs;
    }

    public List<WorkoutDTO> getWorkoutsById(List<String> ids) {
        List<WorkoutDTO> workoutDTOList = new ArrayList<>();
        for(String id: ids) {
            workoutDTOList.add(createDTOFromEntity(this.getWorkout((Long.parseLong(id)))));
        }
        return workoutDTOList;
    }

    public WorkoutDTO test(WorkoutDTO workoutDTO) {
        Workout workout = createEntityFromDTO(workoutDTO, true);
        return createDTOFromEntity(workoutRepo.save(workout));
    }

    public Map<String, Object> getWorkoutAndTrainerInfo(Long id, String currentUserName) {
        Map<String, Object> response = new HashMap<>();
        Trainer trainer = trainerService.getTrainerByUserName(currentUserName);

        if (trainer == null) {
            response.put("workout", null);
            response.put("trainerId", null);
            response.put("isAllowed", false);
        } else if (id == null) {
            response.put("workout", null);
            response.put("trainerId", trainer.getId());
            response.put("isAllowed", true);
        } else {
            Workout workout = workoutRepo.findById(id).orElse(null);
            WorkoutDTO workoutDTO = null;
            if (workout != null) {
                workoutDTO = createDTOFromEntity(workout);
                response.put("workout", workoutDTO);
                response.put("trainerId", trainer.getId());
                response.put("isAllowed", trainer.getId() == workout.getTrainer().getId());
            } else {
                response.put("workout", null);
                response.put("trainerId", trainer.getId());
                response.put("isAllowed", false);
            }
        }
        return response;
    }

    public List<WorkoutDTO> getWorkoutsByTrainer(Long userId) {
        Trainer trainer = trainerService.getTrainerByUserId(userId);
        if (trainer == null) {
            return  null;
        }
        List<Workout> workouts = workoutRepo.findByTrainer(trainer);
        List<WorkoutDTO> result = new ArrayList<>();
        for(Workout workout: workouts) {
            if (workout != null) {
                result.add(createDTOFromEntity(workout));
            }
        }
        return result;
    }

    public Page<WorkoutDTO> searchWorkoutsInPages(String keyword, int page, int size) {
        if (keyword == null || keyword.isEmpty()) {
            return Page.empty();
        }
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Workout> workoutPage = workoutRepo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageRequest);
        List<WorkoutDTO> filteredDTOs = workoutPage.getContent().stream()
                .filter(workout -> workout != null)
                .map(this::createDTOFromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(filteredDTOs, pageRequest, workoutPage.getTotalElements());
    }

    public Page<WorkoutDTO> searchWorkoutsToAdd(String keyword, List<Long> excludeIds, int page, int size, Long userId) {
        if (keyword == null || keyword.isEmpty()) {
            return Page.empty();
        }
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Workout> workoutPage = workoutRepo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageRequest);
        List<WorkoutDTO> filteredDTOs = workoutPage.getContent().stream()
                .filter(workout -> workout != null && workout.getTrainer().getUser().getId() == userId && !excludeIds.contains(workout.getId()))
                .map(this::createDTOFromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(filteredDTOs, pageRequest, workoutPage.getTotalElements());
    }
}
