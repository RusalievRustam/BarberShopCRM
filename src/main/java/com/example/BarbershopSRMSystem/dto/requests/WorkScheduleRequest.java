package com.example.BarbershopSRMSystem.dto.requests;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkScheduleRequest {

    @NotNull(message = "barberId не может быть null")
    private Long barberId;

    @NotBlank(message = "День недели обязателен")
    private String dayOfWeek;

    @NotNull(message = "Время начала обязательно")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime startTime;

    @NotNull(message = "Время окончания обязательно")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime endTime;

    @NotNull(message = "Статус активности обязателен")
    private Boolean active;
}