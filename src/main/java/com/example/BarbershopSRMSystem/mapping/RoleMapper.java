package com.example.BarbershopSRMSystem.mapping;

import com.example.BarbershopSRMSystem.dto.reponses.RoleResponse;
import com.example.BarbershopSRMSystem.entities.Roles;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {
    public RoleResponse map(Roles roles) {
        return new RoleResponse(roles.getId(), roles.getRoleName());
    }
}