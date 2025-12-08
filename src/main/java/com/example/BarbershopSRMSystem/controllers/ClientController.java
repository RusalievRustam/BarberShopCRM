package com.example.BarbershopSRMSystem.controllers;

import com.example.BarbershopSRMSystem.dto.reponses.ClientResponse;
import com.example.BarbershopSRMSystem.dto.requests.ClientRequest;
import com.example.BarbershopSRMSystem.entities.Client;
import com.example.BarbershopSRMSystem.services.ClientService;
import lombok.Cleanup;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.ResourceBundle;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody ClientRequest request){
        ClientResponse response = clientService.createClient(request);
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{clientId}")
    public ResponseEntity<ClientResponse> updateClient(@Valid @RequestBody ClientRequest request, @PathVariable Long clientId){
        return ResponseEntity.ok(clientService.updateClient(clientId,request));
    }

    @GetMapping
    public ResponseEntity<List<ClientResponse>> getAllClients (){
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<ClientResponse> getClientById (@PathVariable Long clientId){
        return ResponseEntity.ok(clientService.getClientById(clientId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ClientResponse>> searchClients(@RequestParam String keyword){
        return ResponseEntity.ok(clientService.searchClients(keyword));
    }

    @GetMapping("/search/phone")
    public ResponseEntity<List<ClientResponse>> searchByPhone(String phoneNumber){
        return ResponseEntity.ok(clientService.findByPhoneNumber(phoneNumber));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ClientResponse> deleteClient (@PathVariable Long id){
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}