package com.example.FitThrive.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.math.BigDecimal;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Data
@Entity
@Table(name="users")
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name="username")
    @NotBlank
    private String username;

    @Column(name="password")
    @NotBlank
    private String password;

    @Column(name="email")
    @NotBlank
    private String email;

    @Column(name="name")
    @NotBlank
    private String name;

    @Column(precision = 5, scale = 2)
    private BigDecimal height;

    @Column(precision = 5, scale = 2)
    private BigDecimal weight;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinTable(
            name = "user_workout_program_m2m",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "workout_program_id")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<WorkoutProgram> enrolledWorkoutPrograms;
}