package com.example.BarbershopSRMSystem.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProcedureRequest {
    @NotBlank
    private String procedureName;

    private String description;

    @NotNull
    private Integer duration;

    @NotNull
    private BigDecimal price;

    @NotNull
    private Long categoryId;

    private Boolean active = true;

}
