package com.example.BarbershopSRMSystem.controllers;

import com.example.BarbershopSRMSystem.dto.reponses.BarberResponse;
import com.example.BarbershopSRMSystem.dto.requests.BarberRequest;
import com.example.BarbershopSRMSystem.services.BarberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/barber")
public class BarberController {

    private final BarberService barberService;

    @PostMapping
    public ResponseEntity<BarberResponse> createBarber(@Valid @RequestBody BarberRequest request) {
        return ResponseEntity.ok(barberService.createBarber(request));
    }

    @GetMapping
    public ResponseEntity<List<BarberResponse>> getAllBarbers(){
        return ResponseEntity.ok(barberService.getAllBarbers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarberResponse> getBarbeById(@PathVariable Long id){
        return ResponseEntity.ok(barberService.getBarberById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BarberResponse> updateBarber(@PathVariable Long id, @RequestBody BarberRequest request){
        return ResponseEntity.ok(barberService.updateBarber(request,id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BarberResponse> deleteBarber(@PathVariable Long id){
        barberService.deleteBarber(id);
        return ResponseEntity.noContent().build();
    }


}
