package com.example.FitThrive.config;

import com.example.FitThrive.service.MyUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import java.util.Arrays;
import java.util.Collections;

@EnableWebSecurity
@Configuration
public class SecurityConfig {
    @Autowired
    MyUserDetailsService userDetailsService;

    @Autowired
    JwtFilter jwtFilter;

    @Autowired
    private CustomAuthenticationSuccessHandler successHandler;

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        return daoAuthenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(customizer -> customizer.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new CorsConfiguration();
                    corsConfig.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
                    corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfig.setAllowedHeaders(Collections.singletonList("*"));
                    corsConfig.setAllowedHeaders(Arrays.asList("X-Requested-With", "X-HTTP-Method-Override", "Content-Type", "Accept", "Authorization"));
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }))
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/register", "/api/auth/login", "/login", "/oauth2/**", "/api/auth/refresh-token", "/api/auth/logout", "/api/auth/check-session").permitAll()
                        .anyRequest().authenticated())
                .formLogin(form -> form.disable())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.getWriter().flush();
                        })
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("accessToken", "refreshToken"))
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}