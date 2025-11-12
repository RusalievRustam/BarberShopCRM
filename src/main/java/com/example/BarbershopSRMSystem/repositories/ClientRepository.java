package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    List<Client> findByPhoneNumberContaining(String phoneNumber);
}
