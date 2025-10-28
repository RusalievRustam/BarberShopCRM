package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Barber;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BarberRepository extends JpaRepository<Barber, Long> {
}
