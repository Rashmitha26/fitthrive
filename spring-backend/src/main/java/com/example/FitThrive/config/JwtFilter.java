package com.example.FitThrive.config;

import com.example.FitThrive.exception.TokenExpiredException;
import com.example.FitThrive.service.JwtService;
import com.example.FitThrive.service.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    JwtService jwtService;

    @Autowired
    ApplicationContext context;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String uri = request.getRequestURI();

        if (uri.equals("/api/auth/refresh-token") || uri.equals("/login") || uri.equals("/register") || uri.equals("/api/auth/login") || uri.equals("/api/auth/logout") || uri.equals("/oauth2/**") || uri.equals("/api/auth/check-session")) {
            filterChain.doFilter(request, response);
            return;
        }
        String username = null;

        Cookie[] cookies = request.getCookies();
        String accessToken = null;
        String refreshToken = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                }
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        if (refreshToken != null && jwtService.isTokenExpired(refreshToken)) {
            response.addCookie(clearCookie("refreshToken"));
            response.addCookie(clearCookie("accessToken"));
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // Optionally return Unauthorized status
            response.getWriter().write("Refresh token expired. Please log in again.");
            return;
        }

        if (accessToken != null) {
            try {
                if (jwtService.isTokenExpired(accessToken)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Token has expired");
                    return;
                }
                username = jwtService.extractUserName(accessToken);
            } catch (TokenExpiredException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token has expired");
                return;
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid token");
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(username);
            if (jwtService.validateToken(accessToken, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private Cookie clearCookie(String name) {
        Cookie accessTokenCookie = new Cookie(name, null);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(0);
        return accessTokenCookie;
    }
}
