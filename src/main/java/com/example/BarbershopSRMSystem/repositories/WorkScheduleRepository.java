package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Barber;
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
    
    Optional<WorkSchedule> findByBarberAndDayOfWeek(Barber barber, DayOfWeek dayOfWeek);
    
    boolean existsByBarberIdAndDayOfWeek(Long barberId, DayOfWeek dayOfWeek);
    
    List<WorkSchedule> findByBarberIdAndActiveTrue(Long barberId);
    
    List<WorkSchedule> findByBarber(Barber barber);
    
    default List<WorkSchedule> findActiveByBarber(Barber barber) {
        return findByBarber(barber).stream()
                .filter(WorkSchedule::getActive)
                .collect(java.util.stream.Collectors.toList());
    }
}
