package com.example.FitThrive.service;

import com.example.FitThrive.dto.TrainerDTO;
import com.example.FitThrive.model.Trainer;
import com.example.FitThrive.model.User;
import com.example.FitThrive.model.UserPrincipal;
import com.example.FitThrive.repo.TrainerRepo;
import com.example.FitThrive.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class TrainerService {

    @Autowired
    TrainerRepo trainerRepo;

    @Autowired
    UserRepo userRepo; // not having userService due to circular reference

    public TrainerDTO addTrainerDTO(TrainerDTO trainerDTO) {
        Trainer trainer = createEntityFromDTO(trainerDTO, true);
        if (trainer == null) {
            return null;
        }
        trainerRepo.save(trainer);
        return createDTOFromEntity(trainer);
    }

    public Trainer addTrainer(Trainer trainer) {
        if (trainer == null) {
            return null;
        }
        trainerRepo.save(trainer);
        return getTrainer(trainer.getId());
    }

    public Trainer getTrainer(long id) {
        return trainerRepo.findById(id).orElse(null);
    }

    public Long getTrainerDTOByUserId(long userId) {
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }
        Trainer trainer = trainerRepo.findByUser(user);
        if (trainer == null) {
            return null;
        }
        return trainer.getId();
    }

    public Trainer getTrainerByUserName(String username) {
        User user = userRepo.findByUsername(username); //.orElse(null);
        if (user == null) {
            return null;
        }
        Trainer trainer = trainerRepo.findByUser(user);
        if (trainer == null) {
            return null;
        }
        return trainer;
    }

    public Trainer getTrainerByUserId(Long userId) {
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }
        Trainer trainer = trainerRepo.findByUser(user);
        if (trainer == null) {
            return null;
        }
        return trainer;
    }

    public TrainerDTO getTrainerDTO(long id) {
        Trainer trainer = getTrainer(id);
        if (trainer == null) {
            return null;
        }
        return createDTOFromEntity(trainer);
    }

    public TrainerDTO updateTrainer(TrainerDTO trainerDTO) {
        Trainer trainer = createEntityFromDTO(trainerDTO, false);
        if (trainer == null) {
            return null;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserPrincipal userPrincipal) {
                Long currentUserId = userPrincipal.getUser().getId();
                if (trainer.getUser().getId() != currentUserId) {
                    return null;
                }
            }
        }
        trainer.setBio(trainerDTO.getBio());
        trainer.setExpertise(trainerDTO.getExpertise());
        trainerRepo.save(trainer);
        return getTrainerDTO(trainerDTO.getId());
    }

    public boolean deleteTrainer(long id) {
        if (trainerRepo.existsById(id)) {
            trainerRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public Trainer createEntityFromDTO(TrainerDTO trainerDTO, boolean shouldCreate) {
        Trainer trainer;

        if (!shouldCreate) {
            trainer = trainerRepo.findById(trainerDTO.getId()).orElse(null);
            if (trainer == null) {
                return null;
            }
        } else {
            trainer = new Trainer();
        }

        User user = userRepo.findById(trainerDTO.getUserId()).orElse(null);

        if (user == null) {
            return null;
        }

        if (shouldCreate)
            trainer.setUser(user);
        if (trainerDTO.getBio() != null)
            trainer.setBio(trainerDTO.getBio());
        if (trainerDTO.getExpertise() != null)
            trainer.setExpertise(trainerDTO.getExpertise());
        return trainer;
    }

    public TrainerDTO createDTOFromEntity(Trainer trainer) {
        if (trainer == null) {
            return null;
        }
        TrainerDTO trainerDTO = new TrainerDTO();
        trainerDTO.setId(trainer.getId());
        trainerDTO.setName(trainer.getUser().getName());
        trainerDTO.setUserId(trainer.getUser().getId());
        trainerDTO.setBio(trainer.getBio());
        trainerDTO.setExpertise(trainer.getExpertise());
        return trainerDTO;
    }
}
