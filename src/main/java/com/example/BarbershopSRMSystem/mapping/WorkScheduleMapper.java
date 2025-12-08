package com.example.BarbershopSRMSystem.mapping;

import com.example.BarbershopSRMSystem.dto.reponses.WorkScheduleResponse;
import com.example.BarbershopSRMSystem.dto.requests.WorkScheduleRequest;
import com.example.BarbershopSRMSystem.entities.WorkSchedule;
import com.example.BarbershopSRMSystem.services.BarberService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;

@Component
@AllArgsConstructor
public class WorkScheduleMapper {

    private BarberService barberService;

    public WorkSchedule mapToEntity(WorkScheduleRequest request) {
        WorkSchedule workSchedule = new WorkSchedule();
        applyRequestToEntity(request, workSchedule);
        return workSchedule;
    }

    public void updateEntityFromRequest(WorkScheduleRequest request, WorkSchedule workSchedule) {
        applyRequestToEntity(request, workSchedule);
    }

    public void applyRequestToEntity(WorkScheduleRequest request, WorkSchedule workSchedule) {
        workSchedule.setBarber(barberService.getBarberEntityById(request.getBarberId()));
        workSchedule.setDayOfWeek(DayOfWeek.valueOf(request.getDayOfWeek()));
        workSchedule.setStartTime(request.getStartTime());
        workSchedule.setEndTime(request.getEndTime());
        workSchedule.setActive(request.getActive());
    }

    public WorkScheduleResponse mapToResponse(WorkSchedule workSchedule) {
        return new WorkScheduleResponse(
                workSchedule.getId(),
                workSchedule.getBarber().getFirstName(),
                workSchedule.getDayOfWeek().name(),
                workSchedule.getStartTime(),
                workSchedule.getEndTime(),
                workSchedule.getActive()
        );
    }
}
