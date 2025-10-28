package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    List<Client> findByPhoneNumberContaining(String phoneNumber);
}
