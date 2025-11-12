package com.example.BarbershopSRMSystem.dto.reponses;

import com.example.BarbershopSRMSystem.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BarberResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String phone;
    private LocalDate hireDate;
    private Status status;
    private Long userId; // только id пользователя
}