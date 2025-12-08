package com.example.BarbershopSRMSystem.controllers;

import com.example.BarbershopSRMSystem.dto.reponses.WorkScheduleResponse;
import com.example.BarbershopSRMSystem.dto.requests.WorkScheduleRequest;
import com.example.BarbershopSRMSystem.services.WorkScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedule")
public class WorkScheduleController {

    private final WorkScheduleService workScheduleService;

    @PostMapping
    public ResponseEntity<WorkScheduleResponse> createSchedule(@RequestBody WorkScheduleRequest request) {
        WorkScheduleResponse response = workScheduleService.createSchedule(request);
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{barberId}")
    public ResponseEntity<WorkScheduleResponse> updateSchedule(@RequestBody WorkScheduleRequest request, @PathVariable Long barberId) {
        return ResponseEntity.ok(workScheduleService.updateSchedule(request, barberId));
    }

    @GetMapping
    public ResponseEntity<List<WorkScheduleResponse>> getScheduleList() {
        return ResponseEntity.ok(workScheduleService.getAllSchedules());
    }

    @GetMapping("/{barberId}")
    public ResponseEntity<WorkScheduleResponse> getScheduleById(@PathVariable Long barberId) {
        return ResponseEntity.ok(workScheduleService.getScheduleById(barberId));
    }

    @PatchMapping("/{scheduleId}")
    public ResponseEntity<Void> setScheduleActive(@PathVariable Long scheduleId) {
        workScheduleService.setScheduleActive(scheduleId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/barber/{barberId}")
    public ResponseEntity<List<WorkScheduleResponse>> getSchedulesByBarber(@PathVariable Long barberId) {
        return ResponseEntity.ok(workScheduleService.getSchedulesByBarber(barberId));
    }

    @GetMapping("/barber/{barberId}/active")
    public ResponseEntity<List<WorkScheduleResponse>> getActiveScheduleByBarber(@PathVariable Long barberId) {
        return ResponseEntity.ok(workScheduleService.getActiveScheduleByBarber(barberId));
    }

    @GetMapping("/{barberId}/is-working")
    public ResponseEntity<Boolean> isBarberWorking(@PathVariable Long barberId, @RequestParam DayOfWeek dayOfWeek){
        boolean working = workScheduleService.isBarberWorkingOnDate(barberId,dayOfWeek);
        return ResponseEntity.ok(working);
    }

    @GetMapping("/{barberId}/day")
    public ResponseEntity<WorkScheduleResponse> getScheduleForDay(@PathVariable Long barberId, @RequestParam DayOfWeek dayOfWeek){
        return ResponseEntity.ok(workScheduleService.getScheduleByBarberAndDay(barberId,dayOfWeek));
    }
}
