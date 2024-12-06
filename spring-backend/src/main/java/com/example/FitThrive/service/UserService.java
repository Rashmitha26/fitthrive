package com.example.FitThrive.service;

import com.example.FitThrive.dto.UserDTO;
import com.example.FitThrive.dto.WorkoutProgramDTO;
import com.example.FitThrive.model.User;
import com.example.FitThrive.model.WorkoutProgram;
import com.example.FitThrive.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private WorkoutProgramService workoutProgramService;

    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);


    public User createUser(User user) {
        if (user == null) {
            return null;
        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    public User getUser(long id) {
        User user = userRepo.findById(id).orElse(null);
        String currentUserName = SecurityContextHolder.getContext().getAuthentication().getName();
        if (user == null || !user.getUsername().equals(currentUserName)) {
            return null;
        }
        return user;
    }

    public UserDTO getUserDTO(long id) {
        User user = getUser(id);
        if (user == null) {
            return null;
        }
        return createDTOFromEntity(user);
    }

    public UserDTO updateUser(UserDTO userDTO) {
        User existingUser = getUser(userDTO.getId());
        if (existingUser == null) {
            return null;
        }

        String currentUserName = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!existingUser.getUsername().equals(currentUserName)) {
            return null;
        }

        if (userDTO.getEmail() != null)
            existingUser.setEmail(userDTO.getEmail());
        if (userDTO.getName() != null)
            existingUser.setName(userDTO.getName());

        existingUser.setHeight(userDTO.getHeight());
        existingUser.setWeight(userDTO.getWeight());

        return createDTOFromEntity(userRepo.save(existingUser));
    }

    public boolean deleteUser(long id) {
        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public UserDTO enrollUserInWorkoutProgram(long userId, long workoutProgramId) {
        WorkoutProgram workoutProgram = workoutProgramService.getWorkoutProgram(workoutProgramId);
        if (workoutProgram == null) {
            return null;
        }
        User user = getUser(userId);
        if (user == null) {
            return null;
        }
        return enrollUserToProgram(user, workoutProgram);
    }

    public UserDTO enrollUserToProgram(User user, WorkoutProgram workoutProgram) {
        if (workoutProgram == null || user == null) {
            return null;
        }
        if(user.getEnrolledWorkoutPrograms().contains(workoutProgram)) {
            return null;
        }
        user.getEnrolledWorkoutPrograms().add(workoutProgram);
//        User newUser = new User();
//        newUser.setId(user.getId());
//        newUser.setUsername(user.getUsername());
//        newUser.setPassword(user.getPassword());
//        newUser.setEmail(user.getEmail());
//        newUser.setName(user.getName());
//        newUser.setHeight(user.getHeight());
//        newUser.setWeight(user.getWeight());
//        Set<WorkoutProgram> newPrograms = new HashSet<>();
//        newPrograms.addAll(user.getEnrolledWorkoutPrograms());
//        newPrograms.add(workoutProgram);
//        newUser.setEnrolledWorkoutPrograms(newPrograms);
        userRepo.save(user);
        return createDTOFromEntity(user);
    }

    public boolean isUserEnrolledInProgram(long userId, long programId) {
        User user = getUser(userId);
        if (user == null) {
            return false;
        }
        for(WorkoutProgram workoutProgram: user.getEnrolledWorkoutPrograms()) {
            if(workoutProgram.getId() == programId) {
                return true;
            }
        }
        return false;
    }

    private UserDTO createDTOFromEntity(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setName(user.getName());
        userDTO.setHeight(userDTO.getHeight());
        userDTO.setWeight(userDTO.getWeight());
        Set<Long> enrolledWorkoutPrograms= new HashSet<>();
        for(WorkoutProgram workoutProgram: user.getEnrolledWorkoutPrograms()) {
            enrolledWorkoutPrograms.add(workoutProgram.getId());
        }
        userDTO.setEnrolledWorkoutPrograms(enrolledWorkoutPrograms);
        return userDTO;
    }

    public Set<WorkoutProgramDTO> getUserWorkoutPrograms(long id) {
        User user = getUser(id);
        if (user == null) {
            return null;
        }
        Set<WorkoutProgramDTO> enrolledWorkoutPrograms = new HashSet<>();
        for(WorkoutProgram workoutProgram: user.getEnrolledWorkoutPrograms()) {
            enrolledWorkoutPrograms.add(workoutProgramService.createDTOFromEntity(workoutProgram));
        }
        return enrolledWorkoutPrograms;
    }

    public UserDTO getUserDTOForName(String name) {
        User user = userRepo.findByUsername(name);
        if (user == null) {
            return null;
        }
        return createDTOFromEntity(user);
    }
}
