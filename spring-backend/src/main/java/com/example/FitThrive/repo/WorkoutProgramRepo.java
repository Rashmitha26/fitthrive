package com.example.FitThrive.repo;

import com.example.FitThrive.model.WorkoutProgram;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkoutProgramRepo extends JpaRepository<WorkoutProgram, Long> {
    List<WorkoutProgram> findByTrainerId(Long trainerId);

    Page<WorkoutProgram> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description, Pageable pageable);
}
