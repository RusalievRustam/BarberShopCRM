package com.example.BarbershopSRMSystem.controllers;

import com.example.BarbershopSRMSystem.dto.reponses.BarberResponse;
import com.example.BarbershopSRMSystem.dto.requests.BarberRequest;
import com.example.BarbershopSRMSystem.services.BarberService;
import com.example.BarbershopSRMSystem.services.DatabaseUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/barber")
public class BarberController {

    private final BarberService barberService;
    private final DatabaseUserDetailsService userService;

    @PostMapping
    public ResponseEntity<BarberResponse> createBarber(@RequestBody BarberRequest request) {
        return ResponseEntity.ok(barberService.createBarber(request));
    }

    @GetMapping
    public ResponseEntity<List<BarberResponse>> getAllBarbers(){
        return ResponseEntity.ok(barberService.getAllBarbers());
    }


}
