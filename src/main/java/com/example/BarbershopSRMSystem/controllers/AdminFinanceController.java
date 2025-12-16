package com.example.BarbershopSRMSystem.controllers;

import com.example.BarbershopSRMSystem.dto.reponses.PaymentResponse;
import com.example.BarbershopSRMSystem.dto.reponses.BarberRevenueResponse;
import com.example.BarbershopSRMSystem.dto.reponses.RevenueResponse;
import com.example.BarbershopSRMSystem.dto.requests.PaymentCreateRequest;
import com.example.BarbershopSRMSystem.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/finance")
public class AdminFinanceController {

    private final PaymentService paymentService;

    @PostMapping("/payments")
    public ResponseEntity<PaymentResponse> createPayment(@RequestBody PaymentCreateRequest request) {
        return ResponseEntity.ok(paymentService.createPayment(request));
    }

    @GetMapping("/revenue")
    public ResponseEntity<RevenueResponse> getRevenue(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        return ResponseEntity.ok(paymentService.getRevenue(LocalDate.parse(startDate), LocalDate.parse(endDate)));
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentResponse>> getPayments(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        return ResponseEntity.ok(paymentService.getPayments(LocalDate.parse(startDate), LocalDate.parse(endDate)));
    }

    @GetMapping("/revenue-by-barber")
    public ResponseEntity<List<BarberRevenueResponse>> getRevenueByBarber(
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        return ResponseEntity.ok(paymentService.getRevenueByBarber(LocalDate.parse(startDate), LocalDate.parse(endDate)));
    }
}
