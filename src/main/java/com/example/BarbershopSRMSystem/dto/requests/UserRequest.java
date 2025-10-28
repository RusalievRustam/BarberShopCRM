package com.example.BarbershopSRMSystem.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {

    @Size(min = 2, max = 70, message = "2-70 symbols required")
    @NotBlank(message = "Field 'username' can't be empty!")
    private String username;

    @Size(min = 8, message = "Password should have 8 or more symbols")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Пароль должен содержать минимум одну заглавную букву, одну строчную, одну цифру и один спецсимвол"
    )
    private String password;

    @NotNull
    private String role;

    private boolean active = true;


}