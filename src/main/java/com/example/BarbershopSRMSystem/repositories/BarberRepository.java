package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Barber;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;

import java.util.Optional;

@Repository
public interface BarberRepository extends JpaRepository<Barber, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Barber b WHERE b.id = :id")
    Optional<Barber> findByIdForUpdate(@Param("id") Long id);
}
