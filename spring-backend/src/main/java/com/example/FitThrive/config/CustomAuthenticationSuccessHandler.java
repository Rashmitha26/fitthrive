package com.example.FitThrive.config;

import com.example.FitThrive.model.UserPrincipal;
import com.example.FitThrive.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    public CustomAuthenticationSuccessHandler(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtService.generateToken(username);

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_OK);

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("token", token);

        Map<String, String> userDetails = new HashMap<>();
        userDetails.put("name", userPrincipal.getUser().getName());
        userDetails.put("id", userPrincipal.getUser().getId()+"");
        userDetails.put("email", userPrincipal.getUser().getEmail());
        userDetails.put("username", userPrincipal.getUser().getUsername());

        responseBody.put("user_details", new ObjectMapper().writeValueAsString(userDetails));

        response.getWriter().write(new ObjectMapper().writeValueAsString(responseBody));
    }
}

