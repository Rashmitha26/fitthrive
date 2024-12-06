package com.example.FitThrive.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "workout_program")
public class WorkoutProgram {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name")
    @NotBlank
    private String name;

    @Column(name = "description")
    @NotBlank
    private String description;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    @NotNull
    @JsonBackReference
    @JsonIgnore
    private Trainer trainer;

    @Column(name = "duration")
    @NotNull
    private int duration; // in days

    @Column(name="tags")
    private String tags;

    @Column(name="equipment")
    private String equipment;

    @Column(name="difficulty")
    @NotNull
    private int difficulty;

    @Column(name="price")
    private BigDecimal price;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "workout_program_m2m",
            joinColumns = @JoinColumn(name = "program_id"),
            inverseJoinColumns = @JoinColumn(name = "workout_id")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    @OrderColumn(name = "pos_no")
    private List<Workout> workouts;
}
