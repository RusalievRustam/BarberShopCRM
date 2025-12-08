package com.example.BarbershopSRMSystem.services;

import com.example.BarbershopSRMSystem.dto.reponses.WorkScheduleResponse;
import com.example.BarbershopSRMSystem.dto.requests.WorkScheduleRequest;
import com.example.BarbershopSRMSystem.entities.WorkSchedule;
import com.example.BarbershopSRMSystem.mapping.WorkScheduleMapper;
import com.example.BarbershopSRMSystem.repositories.WorkScheduleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class WorkScheduleService {

    private final WorkScheduleRepository workScheduleRepository;
    private final WorkScheduleMapper workScheduleMapper;

    public WorkScheduleResponse createSchedule(WorkScheduleRequest request) {
        WorkSchedule workSchedule = workScheduleMapper.mapToEntity(request);
        WorkSchedule saved = workScheduleRepository.save(workSchedule);
        return workScheduleMapper.mapToResponse(saved);
    }

    public WorkScheduleResponse updateSchedule(WorkScheduleRequest request, Long id) {
        WorkSchedule workSchedule = workScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Расписание не найдено!"));
        workScheduleMapper.updateEntityFromRequest(request, workSchedule);
        WorkSchedule saved = workScheduleRepository.save(workSchedule);
        return workScheduleMapper.mapToResponse(saved);
    }

    public List<WorkScheduleResponse> getAllSchedules() {
        return workScheduleRepository.findAll()
                .stream()
                .map(workScheduleMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public WorkScheduleResponse getScheduleById(Long id) {
        WorkSchedule workSchedule = workScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Расписание не найдено!"));
        return workScheduleMapper.mapToResponse(workSchedule);
    }

    public void deleteWorkSchedule(Long id) {
        if (!workScheduleRepository.existsById(id)) {
            throw new RuntimeException("Расписание не найдено!");
        }
        workScheduleRepository.deleteById(id);
    }

    public void setScheduleActive(Long id) {
        WorkSchedule workSchedule = workScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Расписание не найдено!"));
        workSchedule.setActive(true);
        workScheduleRepository.save(workSchedule);
    }

    public List<WorkScheduleResponse> getSchedulesByBarber(Long barberId) {
        List<WorkSchedule> workSchedule = workScheduleRepository.findByBarberId(barberId);
        return workSchedule.stream()
                .map(workScheduleMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<WorkScheduleResponse> getActiveScheduleByBarber(Long barberId){
        return workScheduleRepository.findByBarberIdAndActiveTrue(barberId)
                .stream()
                .map(workScheduleMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public boolean isBarberWorkingOnDate(Long barberId, DayOfWeek dayOfWeek) {
        return workScheduleRepository.existsByBarberIdAndDayOfWeek(barberId, dayOfWeek);
    }

    public WorkScheduleResponse getScheduleByBarberAndDay(Long barberId, DayOfWeek dayOfWeek) {
        WorkSchedule workSchedule = workScheduleRepository.findByBarberIdAndDayOfWeek(barberId,dayOfWeek)
                .orElseThrow(()-> new RuntimeException("Schedule not found!"));
        return workScheduleMapper.mapToResponse(workSchedule);
    }
}
