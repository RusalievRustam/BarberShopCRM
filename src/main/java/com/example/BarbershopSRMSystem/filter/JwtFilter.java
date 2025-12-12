package com.example.BarbershopSRMSystem.filter;

import com.example.BarbershopSRMSystem.services.DatabaseUserDetailsService;
import com.example.BarbershopSRMSystem.services.JWT.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final DatabaseUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = header.substring(7);

            Claims claims = jwtService.extractClaims(token);
            String username = claims.getSubject();
            String role = claims.get("role", String.class); // Получаем "ROLE_ADMIN"

            System.out.println("=== JWT FILTER DEBUG ===");
            System.out.println("Username: " + username);
            System.out.println("Role from token: " + role);
            System.out.println("Request URI: " + request.getRequestURI());

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            System.out.println("UserDetails authorities: " + userDetails.getAuthorities());

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );

            SecurityContextHolder.getContext().setAuthentication(auth);

            System.out.println("Authentication установлен для: " + username);
            System.out.println("========================\n");

        } catch (Exception e) {
            System.err.println("JWT ошибка: " + e.getMessage());
            // Не прерываем цепочку - может быть публичный endpoint
        }

        filterChain.doFilter(request, response);
    }}