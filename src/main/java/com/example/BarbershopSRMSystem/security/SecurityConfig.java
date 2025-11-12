package com.example.BarbershopSRMSystem.security;

import com.example.BarbershopSRMSystem.services.DatabaseUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final DatabaseUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // страница логина и регистрации для браузера
                        .requestMatchers("/users/login", "/users/create", "/users/register").permitAll()
                        // REST API защищаем через Basic Auth
                        .requestMatchers("/api/**").authenticated()
                        // админские страницы
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // остальные страницы требуют авторизации
                        .anyRequest().authenticated()
                )
                // Для браузерных страниц
                .formLogin(form -> form
                        .loginPage("/users/login")
                        .defaultSuccessUrl("/users", true)
                        .permitAll()
                )
                // Для REST API
                .httpBasic(Customizer.withDefaults())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/users/login")
                        .permitAll()
                )
                .userDetailsService(userDetailsService);

        return http.build();
    }
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/users/login", "/users/create", "/users/register").permitAll()
//                        .requestMatchers("/api/**").authenticated()
//                        .requestMatchers("/admin/**").hasRole("ADMIN")
//                        .anyRequest().authenticated()
//                )
//                .formLogin(form -> form
//                        .loginPage("/users/login")
//                        .defaultSuccessUrl("/users", true)
//                        .permitAll()
//                )
//                .logout(logout -> logout
//                        .logoutUrl("/logout")
//                        .logoutSuccessUrl("/users/login")
//                        .permitAll()
//                )
//                .userDetailsService(userDetailsService);
//
//        return http.build();
//    }
}