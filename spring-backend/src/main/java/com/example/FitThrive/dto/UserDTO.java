package com.example.FitThrive.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private long id;
    private String username;
    private String email;
    private String name;
    private BigDecimal height;
    private BigDecimal weight;
    private Set<Long> enrolledWorkoutPrograms;
}
