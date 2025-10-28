package com.example.BarbershopSRMSystem.services;

import com.example.BarbershopSRMSystem.entities.Roles;
import com.example.BarbershopSRMSystem.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    // Получить роль по имени
    public Roles getRoleByName(String roleName) {
        return roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Роль " + roleName + " не найдена"));
    }

    // Создать новую роль
    public Roles createRole(Roles role) {
        return roleRepository.save(role);
    }

    // Получить все роли
    public List<Roles> getAllRoles() {
        return roleRepository.findAll();
    }

    // Удалить роль по id
    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}