package com.example.BarbershopSRMSystem.dto.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank
    private String categoryName;
}
