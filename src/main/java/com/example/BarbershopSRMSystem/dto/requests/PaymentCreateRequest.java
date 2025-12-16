package com.example.BarbershopSRMSystem.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentCreateRequest {
    private Long bookingId;
    private String method; // CASH | CARD
}
