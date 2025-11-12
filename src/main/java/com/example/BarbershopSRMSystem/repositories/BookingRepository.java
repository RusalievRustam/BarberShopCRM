package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByBarberFirstName(String barber);

    List<Booking> findByClientFirstName(String client);
}
