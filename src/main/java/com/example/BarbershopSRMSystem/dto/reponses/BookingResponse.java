package com.example.BarbershopSRMSystem.dto.reponses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {
    private Long id;
    private String clientName;
    private String barberName;
    private String procedureName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
}
