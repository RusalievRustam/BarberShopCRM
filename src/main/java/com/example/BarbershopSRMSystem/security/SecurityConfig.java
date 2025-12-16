package com.example.BarbershopSRMSystem.security;

import com.example.BarbershopSRMSystem.filter.JwtFilter;
import com.example.BarbershopSRMSystem.services.DatabaseUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final DatabaseUserDetailsService userDetailsService;
    private final JwtFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // --- Разрешаем без авторизации ---
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/auth/client/enter"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/roles").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").hasRole("ADMIN")

                        // --- Обычные защищенные API ---
                        .requestMatchers(
                                "/api/booking/**",
                                "/api/procedures/**",
                                "/api/categories/**",
                                "/api/barbers/**",
                                "/api/clients/**"
                        ).authenticated()

                        // --- Только для администратора ---
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/roles/**").hasRole("ADMIN")

                        // --- Только для барбера и админа ---
                        .requestMatchers("/api/schedule/**").hasAnyRole("BARBER", "ADMIN")

                        // --- Всё остальное требует JWT ---
                        .anyRequest().authenticated()
                )

                // JWT фильтр
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // UserDetailsService
                .userDetailsService(userDetailsService);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // CORS для фронта
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:5174")
                        .allowedMethods("*")
                        .allowCredentials(true);
            }
        };
    }
}