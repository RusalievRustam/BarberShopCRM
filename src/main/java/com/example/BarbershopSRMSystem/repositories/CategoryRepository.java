package com.example.BarbershopSRMSystem.repositories;

import com.example.BarbershopSRMSystem.entities.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Categories, Long> {
    Optional<Categories> findByCategory(String category);
}
