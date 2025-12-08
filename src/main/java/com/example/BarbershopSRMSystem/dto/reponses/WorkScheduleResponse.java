package com.example.BarbershopSRMSystem.dto.reponses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkScheduleResponse {
    private Long id;
    private String barberName;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean active;
}
