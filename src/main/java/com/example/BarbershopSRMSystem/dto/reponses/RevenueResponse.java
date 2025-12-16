package com.example.BarbershopSRMSystem.dto.reponses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueResponse {
    private String startDate;
    private String endDate;
    private BigDecimal totalRevenue;
    private long paymentsCount;
}
