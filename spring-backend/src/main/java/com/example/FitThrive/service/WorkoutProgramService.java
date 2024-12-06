package com.example.FitThrive.service;

import com.example.FitThrive.dto.WorkoutDTO;
import com.example.FitThrive.dto.WorkoutProgramDTO;
import com.example.FitThrive.dto.WorkoutProgramM2MDTO;
import com.example.FitThrive.model.Trainer;
import com.example.FitThrive.model.Workout;
import com.example.FitThrive.model.WorkoutProgram;
import com.example.FitThrive.repo.WorkoutProgramRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WorkoutProgramService {
    @Autowired
    WorkoutProgramRepo workoutProgramRepo;

    @Autowired
    WorkoutService workoutService;

    @Autowired
    TrainerService trainerService;

    public WorkoutProgramDTO addWorkoutProgram(WorkoutProgramDTO workoutProgramDTO) {
        WorkoutProgram workoutProgram = createEntityFromDTO(workoutProgramDTO, true);
        workoutProgramRepo.save(workoutProgram);
        return createDTOFromEntity(workoutProgram);
    }

    public WorkoutProgram getWorkoutProgram(long id) {
        return workoutProgramRepo.findById(id).orElse(null);
    }

    public WorkoutProgramDTO getWorkoutProgramDTO(long id) {
        WorkoutProgram workoutProgram =  getWorkoutProgram(id);
        if (workoutProgram == null) {
            return null;
        }
        return createDTOFromEntity(workoutProgram);
    }

    public WorkoutProgramDTO editWorkoutProgram(WorkoutProgramDTO workoutProgramDTO) {
        WorkoutProgram workoutProgram = createEntityFromDTO(workoutProgramDTO, false);
        if (workoutProgram == null) {
            return null;
        }
        return createDTOFromEntity(workoutProgramRepo.save(workoutProgram));
    }

    public boolean deleteWorkoutProgram(long id) {
        if (workoutProgramRepo.existsById(id)) {
            workoutProgramRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public void addWorkoutToProgram(WorkoutProgramM2MDTO workoutProgramM2MDTO) {
        WorkoutProgram workoutProgram = getWorkoutProgram(workoutProgramM2MDTO.getProgramId());
        if (workoutProgram == null) {
            return;
        }
        Workout workout = workoutService.getWorkout(workoutProgramM2MDTO.getWorkoutId());
        if (workout == null) {
            return;
        }
        List<Workout> workoutSet = workoutProgram.getWorkouts();
        workoutSet.add(workoutProgramM2MDTO.getPos_no()-1, workout);
        workoutProgram.setWorkouts(workoutSet);
        workoutProgramRepo.save(workoutProgram);
    }

    public List<WorkoutProgramDTO> getWorkoutPrograms() {
        List<WorkoutProgram> workoutPrograms = workoutProgramRepo.findAll();
        return workoutPrograms.stream().map(this::createDTOFromEntity).collect(Collectors.toList());
    }

    public List<WorkoutProgramDTO> getWorkoutProgramsInSortedOrder(String order) {
        List<WorkoutProgram>  workoutPrograms;
        if (order.equals("asc")) {
            workoutPrograms = workoutProgramRepo.findAll(Sort.by(Sort.Order.asc("createdDate")));
        } else {
            workoutPrograms = workoutProgramRepo.findAll(Sort.by(Sort.Order.desc("createdDate")));
        }
        List<WorkoutProgramDTO> workoutProgramDTOS = new ArrayList<>();
        for(WorkoutProgram workoutProgram:  workoutPrograms) {
            workoutProgramDTOS.add(createDTOFromEntity(workoutProgram));
        }
        return workoutProgramDTOS;
    }

    public List<WorkoutProgramDTO> getWorkoutProgramsByUser(Long id) {
        Trainer trainer = trainerService.getTrainerByUserId(id);
        if (trainer == null) {
            return null;
        }
        List<WorkoutProgram> programs = workoutProgramRepo.findByTrainerId(trainer.getId());
        List<WorkoutProgramDTO> result = new ArrayList<>();
        for(WorkoutProgram program: programs) {
            result.add(createDTOFromEntity(program));
        }
        return result;
    }

    private WorkoutProgram createEntityFromDTO(WorkoutProgramDTO workoutProgramDTO, boolean shouldCreate) {
        WorkoutProgram workoutProgram;

        if (!shouldCreate) {
            workoutProgram = workoutProgramRepo.findById(workoutProgramDTO.getId()).orElse(null);
            if (workoutProgram == null) {
                return null;
            }
        } else {
            workoutProgram = new WorkoutProgram();
        }

        Trainer trainer = trainerService.getTrainer(workoutProgramDTO.getTrainer_id());
        if (trainer == null) {
            return null;
        }

        workoutProgram.setName(workoutProgramDTO.getName());
        workoutProgram.setDescription(workoutProgramDTO.getDescription());
        if (shouldCreate) {
            workoutProgram.setTrainer(trainer);
        }
        workoutProgram.setDuration(workoutProgramDTO.getDuration());
        workoutProgram.setTags(workoutProgramDTO.getTags());
        workoutProgram.setEquipment(workoutProgramDTO.getEquipment());
        workoutProgram.setDifficulty(workoutProgramDTO.getDifficulty());
        workoutProgram.setPrice(workoutProgramDTO.getPrice());
        if (!shouldCreate) {
            workoutProgram.setCreatedAt(workoutProgram.getCreatedAt());
        }
        return workoutProgram;
    }

    public WorkoutProgramDTO createDTOFromEntity(WorkoutProgram workoutProgram) {
        return new WorkoutProgramDTO(workoutProgram);
    }

    public Map<String, Object> getWorkoutProgramAndTrainerInfo(Long id, String currentUserName) {
        Map<String, Object> response = new HashMap<>();
        Trainer trainer = trainerService.getTrainerByUserName(currentUserName);

        if (trainer == null) {
            response.put("workoutProgram", null);
            response.put("trainerId", null);
            response.put("isAllowed", false);
        } else if (id == null) {
            response.put("workoutProgram", null);
            response.put("trainerId", trainer.getId());
            response.put("isAllowed", true);
        } else {
            WorkoutProgram workoutProgram = workoutProgramRepo.findById(id).orElse(null);
            WorkoutProgramDTO workoutProgramDTO = null;
            if (workoutProgram != null) {
                workoutProgramDTO = createDTOFromEntity(workoutProgram);
                response.put("workoutProgram", workoutProgramDTO);
                response.put("trainerId", trainer.getId());
                response.put("isAllowed", trainer.getId() == workoutProgram.getTrainer().getId());
            } else {
                response.put("workout", null);
                response.put("trainerId", trainer.getId());
                response.put("isAllowed", false);
            }
        }
        return response;
    }

    public List<WorkoutDTO> getWorkoutDTOs(long id) {
        WorkoutProgram workoutProgram = getWorkoutProgram(id);
        if (workoutProgram == null) {
            return null;
        }
        List<Workout> workouts = workoutProgram.getWorkouts();
        List<WorkoutDTO> result = new ArrayList<>();
        for(Workout workout: workouts) {
            if (workout != null) {
                result.add(workoutService.createDTOFromEntity(workout));
            }
        }
        return result;
    }

    public List<WorkoutDTO> setWorkouts(long id, List<WorkoutDTO> workoutDTOS) {
        WorkoutProgram workoutProgram = getWorkoutProgram(id);
        if (workoutProgram == null) {
            return null;
        }
        List<Workout> workouts = new ArrayList<>();
        for(WorkoutDTO workoutDTO: workoutDTOS) {
            workouts.add(workoutService.createEntityFromDTO(workoutDTO, false));
        }
        workoutProgram.setWorkouts(workouts);
        workoutProgramRepo.save(workoutProgram);
        return getWorkoutDTOs(id);
    }

    public Page<WorkoutProgramDTO> getWorkoutProgramsInPages(int page, int size) {
        Sort sort = Sort.by(Sort.Order.desc("updatedAt"));
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<WorkoutProgram> workoutPage = workoutProgramRepo.findAll(pageRequest);
        return workoutPage.map(this::createDTOFromEntity);
    }

    public Page<WorkoutProgramDTO> searchWorkoutProgramsInPages(String keyword, int page, int size) {
        if (keyword == null || keyword.isEmpty()) {
            return Page.empty();
        }
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<WorkoutProgram> workoutPage = workoutProgramRepo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageRequest);
        List<WorkoutProgramDTO> filteredDTOs = workoutPage.getContent().stream()
                .filter(workoutProgram -> workoutProgram != null)
                .map(this::createDTOFromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(filteredDTOs, pageRequest, workoutPage.getTotalElements());
    }

    public Page<WorkoutProgramDTO> recentWorkoutProgramsInPages(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        Page<WorkoutProgram> workoutPage = workoutProgramRepo.findAll(pageRequest);
        List<WorkoutProgramDTO> filteredDTOs = workoutPage.getContent().stream()
                .filter(workoutProgram -> workoutProgram != null)
                .map(this::createDTOFromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(filteredDTOs, pageRequest, workoutPage.getTotalElements());
    }
}
