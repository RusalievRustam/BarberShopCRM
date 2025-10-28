package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Categories;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Categories, Long> {
    Optional<Categories> findByCategory(String category);
}
