package com.example.FitThrive.repo;

import com.example.FitThrive.model.Workout;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.FitThrive.model.Trainer;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;

import java.util.List;

@Repository
public interface WorkoutRepo extends JpaRepository<Workout, Long> {
    Workout findByName(String name);

    List<Workout> findByTrainer(Trainer trainer);

    List<Workout> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String nameKeyWord, String descKeyWord);

    @Query("SELECT w FROM Workout w WHERE w.trainer.id = :trainerId")
    List<Workout> findWorkoutsByTrainerId(@Param("trainerId") Long trainerId);

    Page<Workout> findAll(Pageable pageable);

    Page<Workout> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description, Pageable pageable);
}
