package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Categories;
import com.example.BarbershopSRMSystem.entities.Procedure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProcedureRepository extends JpaRepository<Procedure, Long> {
    List<Procedure> findByCategory(Categories category);
    List<Procedure> findByActive(Boolean active);
}
