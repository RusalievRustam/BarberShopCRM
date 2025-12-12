package com.example.BarbershopSRMSystem.controllers;

import com.example.BarbershopSRMSystem.dto.reponses.BarberAvailabilityResponse;
import com.example.BarbershopSRMSystem.dto.reponses.BarberResponse;
import com.example.BarbershopSRMSystem.dto.requests.BarberAvailabilityRequest;
import com.example.BarbershopSRMSystem.dto.requests.BarberRequest;
import com.example.BarbershopSRMSystem.services.BarberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/barbers")
public class BarberController {

    private final BarberService barberService;

    @PostMapping
    public ResponseEntity<BarberResponse> createBarber(@Valid @RequestBody BarberRequest request) {
        return ResponseEntity.ok(barberService.createBarber(request));
    }

    @GetMapping
    public ResponseEntity<List<BarberResponse>> getAllBarbers() {
        return ResponseEntity.ok(barberService.getAllBarbers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarberResponse> getBarberById(@PathVariable Long id) {
        return ResponseEntity.ok(barberService.getBarberById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BarberResponse> updateBarber(
            @PathVariable Long id, 
            @Valid @RequestBody BarberRequest request) {
        return ResponseEntity.ok(barberService.updateBarber(request, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBarber(@PathVariable Long id) {
        barberService.deleteBarber(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{barberId}/availability")
    public ResponseEntity<List<BarberAvailabilityResponse>> getBarberAvailability(
            @PathVariable Long barberId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(barberService.getBarberAvailability(barberId, date));
    }

    @PostMapping("/{barberId}/availability")
    public ResponseEntity<Void> setBarberAvailability(
            @PathVariable Long barberId,
            @Valid @RequestBody BarberAvailabilityRequest request) {
        barberService.setBarberAvailability(barberId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{barberId}/available-slots")
    public ResponseEntity<List<LocalTime>> getAvailableTimeSlots(
            @PathVariable Long barberId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer durationMinutes) {
        return ResponseEntity.ok(barberService.getAvailableTimeSlots(barberId, date, durationMinutes));
    }

    @GetMapping("/{barberId}/schedule")
    public ResponseEntity<List<BarberAvailabilityResponse>> getBarberWeeklySchedule(
            @PathVariable Long barberId) {
        return ResponseEntity.ok(barberService.getBarberWeeklySchedule(barberId));
    }
}
