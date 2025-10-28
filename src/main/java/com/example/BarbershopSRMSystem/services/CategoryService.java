package com.example.BarbershopSRMSystem.services;

import com.example.BarbershopSRMSystem.dto.reponses.CategoryResponse;
import com.example.BarbershopSRMSystem.dto.requests.CategoryRequest;
import com.example.BarbershopSRMSystem.entities.Categories;
import com.example.BarbershopSRMSystem.repositories.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CategoryService {

    private CategoryRepository categoryRepository;

    public CategoryResponse createCategory(CategoryRequest request){
        Categories category = new Categories();
        category.setCategory(request.getCategoryName());
        Categories saved = categoryRepository.save(category);
        return new CategoryResponse(category.getId(), category.getCategory());
    }
}
