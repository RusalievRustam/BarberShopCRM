package com.example.BarbershopSRMSystem.dto.requests;

import com.example.BarbershopSRMSystem.enums.Status;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BarberRequest {
    @NotBlank(message = "Имя обязательно")
    private String firstName;
    @NotBlank(message = "Фамилия обязательно")
    private String lastName;
    @NotBlank(message = "Номер телефона обязателен")
    private String phone;
    @NotBlank(message = "Статус обязательно")
    private String status;
}