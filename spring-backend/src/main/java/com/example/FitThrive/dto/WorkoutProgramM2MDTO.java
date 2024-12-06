package com.example.FitThrive.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutProgramM2MDTO {
    private long programId;
    private long workoutId;
    private int pos_no;
}
