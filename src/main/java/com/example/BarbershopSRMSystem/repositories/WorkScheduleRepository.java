package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.WorkSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, Long> {
}
