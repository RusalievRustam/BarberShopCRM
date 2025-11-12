package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.WorkSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

@Repository
public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, Long> {
}
