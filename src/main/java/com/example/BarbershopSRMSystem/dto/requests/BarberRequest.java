package com.example.BarbershopSRMSystem.dto.requests;

import com.example.BarbershopSRMSystem.enums.Status;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BarberRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private Status status;
    private Long userId; // только id пользователя
}