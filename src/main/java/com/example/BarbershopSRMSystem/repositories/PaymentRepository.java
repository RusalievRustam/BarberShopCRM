package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Booking;
import com.example.BarbershopSRMSystem.entities.Payment;
import com.example.BarbershopSRMSystem.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    boolean existsByBookingAndStatus(Booking booking, PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'PAID' AND p.paidAt >= :start AND p.paidAt < :end")
    BigDecimal sumPaidForPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'PAID' AND p.paidAt >= :start AND p.paidAt < :end")
    long countPaidForPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT p FROM Payment p WHERE p.status = 'PAID' AND p.paidAt >= :start AND p.paidAt < :end ORDER BY p.paidAt DESC")
    List<Payment> findPaidForPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT " +
            "p.booking.barber.id, " +
            "CONCAT(p.booking.barber.firstName, ' ', p.booking.barber.lastName), " +
            "COALESCE(SUM(p.amount), 0), " +
            "COUNT(p) " +
            "FROM Payment p " +
            "WHERE p.status = 'PAID' AND p.paidAt >= :start AND p.paidAt < :end " +
            "GROUP BY p.booking.barber.id, p.booking.barber.firstName, p.booking.barber.lastName " +
            "ORDER BY COALESCE(SUM(p.amount), 0) DESC")
    List<Object[]> revenueByBarberForPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
