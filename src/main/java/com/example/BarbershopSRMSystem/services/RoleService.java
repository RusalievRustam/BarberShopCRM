package com.example.BarbershopSRMSystem.services;

import com.example.BarbershopSRMSystem.dto.reponses.RoleResponse;
import com.example.BarbershopSRMSystem.entities.Roles;
import com.example.BarbershopSRMSystem.mapping.RoleMapper;
import com.example.BarbershopSRMSystem.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    // Получить роль по имени
    public Roles getRoleByName(String roleName) {
        return roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Роль " + roleName + " не найдена"));
    }

    public Roles getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }


    // Создать новую роль
    public Roles createRole(Roles role) {
        return roleRepository.save(role);
    }

    // Получить все роли
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::map)
                .collect(Collectors.toList());
    }

    // Удалить роль по id
    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}