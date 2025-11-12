package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Barber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BarberRepository extends JpaRepository<Barber, Long> {
}
