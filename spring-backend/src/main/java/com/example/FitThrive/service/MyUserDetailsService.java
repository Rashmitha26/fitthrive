package com.example.FitThrive.service;

import com.example.FitThrive.model.User;
import com.example.FitThrive.model.UserPrincipal;
import com.example.FitThrive.repo.TrainerRepo;
import com.example.FitThrive.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    UserRepo userRepo;

    @Autowired
    TrainerRepo trainerRepo;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(identifier);
        if (user == null) {
            user = userRepo.findByEmail(identifier);
        }
        if (user == null) {
            throw new UsernameNotFoundException("User with username/email: "+identifier+" not found");
        }
        boolean isTrainer = trainerRepo.existsByUser(user);
        return new UserPrincipal(user, isTrainer);
    }
}
