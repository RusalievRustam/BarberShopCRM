package com.example.BarbershopSRMSystem.controllers;

import com.example.BarbershopSRMSystem.dto.reponses.ProcedureResponse;
import com.example.BarbershopSRMSystem.dto.requests.ProcedureRequest;
import com.example.BarbershopSRMSystem.entities.Procedure;
import com.example.BarbershopSRMSystem.services.ProcedureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procedures")
@RequiredArgsConstructor
public class ProcedureController {

    private final ProcedureService procedureService;

    @GetMapping
    public ResponseEntity<List<ProcedureResponse>> getAllProcedures(){
        return ResponseEntity.ok(procedureService.getAllProcedures());
    }

    @PostMapping
    public ResponseEntity<ProcedureResponse> createProcedure(@Valid @RequestBody ProcedureRequest request){
        return ResponseEntity.ok(procedureService.createProcedure(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProcedureResponse> getProcedureById(@PathVariable Long id){
        return ResponseEntity.ok(procedureService.getProcedureById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Procedure> deleteProcedure(@PathVariable Long id){
        procedureService.deleteProcedure(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProcedureResponse> updateProcedure(@PathVariable Long id, @Valid @RequestBody ProcedureRequest request){
        return ResponseEntity.ok(procedureService.updateProcedure(id,request));
    }

    @GetMapping("/search/category")
    public ResponseEntity<List<ProcedureResponse>> findByCategory(@RequestParam String category){
        return ResponseEntity.ok(procedureService.findByCategory(category));
    }
    @GetMapping("/search/byActive")
    public ResponseEntity<List<ProcedureResponse>> findByActive(@RequestParam Boolean active){
        return ResponseEntity.ok(procedureService.findByActive(active));
    }
}
