package com.example.FitThrive.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {

    private User user;
    private boolean isTrainer;

    public UserPrincipal(User user, boolean isTrainer) {
        this.user = user;
        this.isTrainer = isTrainer;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.isTrainer ? Collections.singleton(new SimpleGrantedAuthority("ROLE_TRAINER")) : Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return this.user.getPassword();
    }

    @Override
    public String getUsername() {
        return this.user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; //UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; //UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; //UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return true; //UserDetails.super.isEnabled();
    }

    public User getUser() {
        return this.user;
    }

    public boolean isTrainer() {
        return this.isTrainer;
    }
}
