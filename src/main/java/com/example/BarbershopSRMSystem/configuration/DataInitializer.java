package com.example.BarbershopSRMSystem.configuration;

import com.example.BarbershopSRMSystem.dto.requests.UserRequest;
import com.example.BarbershopSRMSystem.entities.Roles;
import com.example.BarbershopSRMSystem.services.DatabaseUserDetailsService;
import com.example.BarbershopSRMSystem.services.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final DatabaseUserDetailsService userService;
    private final RoleService roleService;

    @Override
    public void run(String... args) {
        // Создаём роль ADMIN, если её ещё нет
        Roles role = roleService.getRoleByName("ADMIN");
        if (role == null) {
            role = new Roles();
            role.setRoleName("ADMIN");
            role = roleService.createRole(role); // сохраняем в базе и получаем объект с id
        }

        // Создаём пользователя, если пользователей ещё нет
        if (userService.countUsers() == 0) {
            UserRequest userRequest = new UserRequest();
            userRequest.setUsername("admin");
            userRequest.setPassword("12345");
            userRequest.setRole(role.getRoleName()); // строка для DTO

            userService.createUser(userRequest, role); // передаём объект роли с id
            System.out.println("Создан пользователь admin / 12345");
        }
    }
}