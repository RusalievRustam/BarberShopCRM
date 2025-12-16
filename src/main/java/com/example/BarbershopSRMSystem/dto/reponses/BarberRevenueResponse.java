package com.example.BarbershopSRMSystem.dto.reponses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BarberRevenueResponse {
    private Long barberId;
    private String barberName;
    private BigDecimal totalRevenue;
    private long paymentsCount;
}
