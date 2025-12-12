package com.example.BarbershopSRMSystem.dto.reponses;

import com.example.BarbershopSRMSystem.entities.Booking;
import com.example.BarbershopSRMSystem.entities.WorkSchedule;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Data
public class BarberAvailabilityResponse {
    private Long barberId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean available;
    private List<TimeSlot> bookedSlots;
    
    @Data
    public static class TimeSlot {
        private LocalTime startTime;
        private LocalTime endTime;
        private BookingResponse booking;
    }
}
