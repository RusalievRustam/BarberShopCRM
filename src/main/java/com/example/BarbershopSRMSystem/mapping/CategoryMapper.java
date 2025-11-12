package com.example.BarbershopSRMSystem.mapping;

import com.example.BarbershopSRMSystem.dto.requests.CategoryRequest;
import com.example.BarbershopSRMSystem.entities.Categories;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public void applyRequestToEntity(CategoryRequest request, Categories category){
        category.setCategory(request.getCategoryName());
    }

    public void updateEntityFromRequest(){
    }
}
