package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.WorkSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, Long> {
    List<WorkSchedule> findByBarberId(Long id);
    Optional<WorkSchedule> findByBarberIdAndDayOfWeek(Long barberId, DayOfWeek dayOfWeek);

    boolean existsByBarberIdAndDayOfWeek(Long barberId,DayOfWeek dayOfWeek);

    List<WorkSchedule> findByBarberIdAndActiveTrue(Long barberId);
}
