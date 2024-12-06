package com.example.FitThrive.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerDTO {
    private long id;
    private long userId;
    private String name;
    private String bio;
    private String expertise;
}
