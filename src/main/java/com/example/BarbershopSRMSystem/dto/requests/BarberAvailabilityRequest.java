package com.example.BarbershopSRMSystem.dto.requests;

import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
public class BarberAvailabilityRequest {
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean available;
}
