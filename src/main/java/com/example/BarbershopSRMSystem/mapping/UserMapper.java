package com.example.BarbershopSRMSystem.mapping;

import com.example.BarbershopSRMSystem.dto.reponses.RoleResponse;
import com.example.BarbershopSRMSystem.dto.reponses.UserResponse;
import com.example.BarbershopSRMSystem.dto.requests.UserRequest;
import com.example.BarbershopSRMSystem.entities.Roles;
import com.example.BarbershopSRMSystem.entities.User;
import com.example.BarbershopSRMSystem.repositories.RoleRepository;
import com.example.BarbershopSRMSystem.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final RoleRepository roleRepository;

    public User mapToEntity(UserRequest request) {
        User user = new User();
        applyRequestToEntity(request, user);
        return user;
    }

    public void userUpdateToEntity(UserRequest request, User user) {
        applyRequestToEntity(request, user);
    }

    private void applyRequestToEntity(UserRequest request, User user) {
        Roles roles = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setActive(request.isActive());
        user.setRole(roles);
    }

    public UserResponse mapToResponse(User user) {
        RoleResponse roleResponse = new RoleResponse(
                user.getRole().getId(),
                user.getRole().getRoleName()
        );
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                roleResponse
        );
    }
}
