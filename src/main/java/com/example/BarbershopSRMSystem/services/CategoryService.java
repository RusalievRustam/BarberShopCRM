package com.example.BarbershopSRMSystem.services;

import com.example.BarbershopSRMSystem.dto.reponses.CategoryResponse;
import com.example.BarbershopSRMSystem.mapping.CategoryMapper;
import com.example.BarbershopSRMSystem.repositories.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryResponse> getAllCategories(){
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::map)
                .collect(Collectors.toList());
    }
}
