package com.example.FitThrive.controller;

import com.example.FitThrive.model.UserPrincipal;
import com.example.FitThrive.service.JwtService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletResponse servletResponse) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            if (authentication.isAuthenticated()) {
                String token = jwtService.generateToken(username);
                String refreshToken = jwtService.createRefreshToken(username);
                Map<String, String> response = new HashMap<>();

                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                Map<String, String> userDetails = new HashMap<>();
                userDetails.put("name", userPrincipal.getUser().getName());
                userDetails.put("id", userPrincipal.getUser().getId() + "");
                userDetails.put("email", userPrincipal.getUser().getEmail());
                userDetails.put("username", userPrincipal.getUser().getUsername());
                response.put("user_details", new ObjectMapper().writeValueAsString(userDetails));

                Cookie accessTokenCookie = new Cookie("accessToken", token);
                accessTokenCookie.setHttpOnly(true);
                accessTokenCookie.setSecure(true);
                accessTokenCookie.setPath("/");
                accessTokenCookie.setMaxAge(60 * 60 * 24 * 7);
                accessTokenCookie.setAttribute("SameSite", "Lax");
                servletResponse.addCookie(accessTokenCookie);


                Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
                refreshTokenCookie.setHttpOnly(true);
                refreshTokenCookie.setSecure(true);
                refreshTokenCookie.setPath("/");
                refreshTokenCookie.setMaxAge(60 * 60 * 24 * 7);
                refreshTokenCookie.setAttribute("SameSite", "None");
                servletResponse.addCookie(refreshTokenCookie);
                return ResponseEntity.ok(response);

            }
        } catch (AuthenticationException | JsonProcessingException e) {
            return ResponseEntity.status(401).body("Login failed");
        }
        return ResponseEntity.status(401).body("Login failed");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@CookieValue(value = "refreshToken", defaultValue = "") String refreshToken, HttpServletResponse response) {
        if (refreshToken.isEmpty()) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Refresh token is missing.");
        }
        if (jwtService.isValidRefreshToken(refreshToken)) {
            String newAccessToken = jwtService.createAccessTokenFromRefresh(refreshToken);
            Cookie accessTokenCookie = new Cookie("accessToken", newAccessToken);
            accessTokenCookie.setHttpOnly(true);
            accessTokenCookie.setSecure(true);
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge(60 * 60 * 24 * 7);
            accessTokenCookie.setAttribute("SameSite", "Lax");
            response.addCookie(accessTokenCookie);
            return ResponseEntity.ok(newAccessToken);
        } else {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Invalid refresh token");
        }
    }

    @GetMapping("/check-session")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        String accessToken = getCookieValue(request, "accessToken");

        if (accessToken == null || jwtService.isTokenExpired(accessToken)) {
            String refreshToken = getCookieValue(request, "refreshToken");
            if (refreshToken != null && jwtService.isValidRefreshToken(refreshToken)) {
                String newAccessToken = jwtService.createAccessTokenFromRefresh(refreshToken);
                return ResponseEntity.ok().body(newAccessToken);
            } else {
                return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Session expired");
            }
        }

        return ResponseEntity.ok().body("User is logged in");
    }

    private String getCookieValue(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(cookieName)) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}