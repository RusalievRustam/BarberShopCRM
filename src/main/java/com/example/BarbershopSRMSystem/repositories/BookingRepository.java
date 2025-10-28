package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
