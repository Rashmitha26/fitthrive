package com.example.FitThrive.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name="workout")
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private long id;

    @Column(name="name")
    @NotBlank
    private String name;

    @Column(name="description")
    @NotBlank
    private String description;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    @NotNull
    private Trainer trainer;

    @Column(name="duration")
    @NotNull
    private String duration; // in minutes

    @Column(name="url")
    @NotBlank
    private String url;
}
