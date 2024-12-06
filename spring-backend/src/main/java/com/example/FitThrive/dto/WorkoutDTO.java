package com.example.FitThrive.dto;

import com.example.FitThrive.model.Trainer;
import com.example.FitThrive.model.Workout;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutDTO {
    private long id;
    private String name;
    private String description;
    private long trainer_id;
    private String trainer_name;
    private String duration;
    private String url;

    public WorkoutDTO(Workout workout) {
        this.id = workout.getId();
        this.name = workout.getName();
        this.description = workout.getDescription();
        Trainer trainer = workout.getTrainer();
        this.trainer_id = trainer.getId();
        this.trainer_name = trainer.getUser().getName();
        this.duration = workout.getDuration();
        this.url = workout.getUrl();
    }

    public void setTrainerId(long id) {
        this.trainer_id = id;
    }

    public void setTrainerName(String name) {
        this.trainer_name = name;
    }
}
