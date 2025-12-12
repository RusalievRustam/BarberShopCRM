package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Barber;
import com.example.BarbershopSRMSystem.entities.Booking;
import com.example.BarbershopSRMSystem.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByBarberFirstName(String barber);
    
    List<Booking> findByClientFirstName(String client);
    
    List<Booking> findByBarber(Barber barber);
    
    @Query("SELECT b FROM Booking b WHERE b.barber = :barber AND " +
           "((b.startTime BETWEEN :start AND :end) OR " +
           "(b.endTime BETWEEN :start AND :end) OR " +
           "(b.startTime <= :start AND b.endTime >= :end))")
    List<Booking> findOverlappingBookings(
            @Param("barber") Barber barber,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
    
    @Query("SELECT b FROM Booking b WHERE b.barber = :barber AND " +
           "b.status <> 'CANCELLED' AND " +
           "b.startTime >= :startOfDay AND b.startTime <= :endOfDay")
    List<Booking> findByBarberAndStartTimeBetween(
            @Param("barber") Barber barber,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );
    
    @Query("SELECT b FROM Booking b WHERE b.barber = :barber AND " +
           "b.status = 'CONFIRMED' AND " +
           "((b.startTime >= :start AND b.startTime < :end) OR " +
           "(b.endTime > :start AND b.endTime <= :end) OR " +
           "(b.startTime <= :start AND b.endTime >= :end))")
    List<Booking> findConflictingBookings(
            @Param("barber") Barber barber,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
    
    List<Booking> findByBarberAndStatusNot(Barber barber, BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.barber = :barber AND " +
           "b.status <> 'CANCELLED' AND " +
           "b.startTime >= :start AND b.startTime < :end")
    List<Booking> findActiveBookingsForPeriod(
            @Param("barber") Barber barber,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
