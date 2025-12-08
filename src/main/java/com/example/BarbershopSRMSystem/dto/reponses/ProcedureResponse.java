package com.example.BarbershopSRMSystem.dto.reponses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcedureResponse {
    private Long id;
    private String procedureName;
    private String description;
    private Integer duration;
    private BigDecimal price;
    private CategoryResponse category;
    private Boolean active;


}
