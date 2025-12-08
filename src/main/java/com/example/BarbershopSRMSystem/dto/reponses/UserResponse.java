package com.example.BarbershopSRMSystem.dto.reponses;

import com.example.BarbershopSRMSystem.entities.Roles;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private RoleResponse role;
}