package com.example.BarbershopSRMSystem.dto.requests;

import com.example.BarbershopSRMSystem.entities.Roles;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotNull
    private Long roleId;
    private Boolean active = true;


}
