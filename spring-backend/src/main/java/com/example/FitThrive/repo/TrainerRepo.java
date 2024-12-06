package com.example.FitThrive.repo;

import com.example.FitThrive.model.Trainer;
import com.example.FitThrive.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainerRepo extends JpaRepository<Trainer, Long> {
    boolean existsByUser(User user);
    Trainer findByUser(User user);
}
