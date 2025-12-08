package com.example.BarbershopSRMSystem.mapping;

import com.example.BarbershopSRMSystem.dto.reponses.CategoryResponse;
import com.example.BarbershopSRMSystem.entities.Categories;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryResponse map(Categories categories){
        return new CategoryResponse(categories.getId(),categories.getCategoryName());
    }
}
