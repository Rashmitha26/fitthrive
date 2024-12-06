package com.example.FitThrive.dto;

import com.example.FitThrive.model.Trainer;
import com.example.FitThrive.model.Workout;
import com.example.FitThrive.model.WorkoutProgram;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutProgramDTO {
    private long id;
    private String name;
    private String description;
    private long trainer_id;
    private String trainer_name;
    private int duration;
    private String tags;
    private String equipment;
    private int difficulty;
    private BigDecimal price;
    private List<Long> workoutIds;

    public WorkoutProgramDTO(WorkoutProgram workoutProgram) {
        this.id = workoutProgram.getId();
        this.name = workoutProgram.getName();
        this.description = workoutProgram.getDescription();
        Trainer trainer = workoutProgram.getTrainer();
        this.trainer_id = trainer.getId();
        this.trainer_name = trainer.getUser().getName();
        this.duration = workoutProgram.getDuration();
        this.tags = workoutProgram.getTags();
        this.equipment = workoutProgram.getEquipment();
        this.difficulty = workoutProgram.getDifficulty();
        this.price = workoutProgram.getPrice();
        List<Long> workoutIds = new ArrayList<>();
        List<Workout> workouts = workoutProgram.getWorkouts();
        if (workouts != null && !workouts.isEmpty()) {
            for(Workout workout: workouts) {
                if (workout != null)
                    workoutIds.add(workout.getId());
            }
        }
        this.workoutIds = workoutIds;
    }
}
