package com.example.BarbershopSRMSystem.services;

import com.example.BarbershopSRMSystem.dto.reponses.ProcedureResponse;
import com.example.BarbershopSRMSystem.dto.requests.ProcedureRequest;
import com.example.BarbershopSRMSystem.entities.Categories;
import com.example.BarbershopSRMSystem.entities.Procedure;
import com.example.BarbershopSRMSystem.mapping.ProcedureMapper;
import com.example.BarbershopSRMSystem.repositories.CategoryRepository;
import com.example.BarbershopSRMSystem.repositories.ProcedureRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProcedureService {

    private ProcedureRepository procedureRepository;
    private ProcedureMapper procedureMapper;
    private CategoryRepository categoryRepository;


    public ProcedureResponse createProcedure(ProcedureRequest request) {
        Procedure procedure = procedureMapper.mapToEntity(request);
        Procedure saved = procedureRepository.save(procedure);
        return procedureMapper.mapToResponse(procedure);
    }

    public List<ProcedureResponse> getAllProcedures() {
        return procedureRepository.findAll()
                .stream()
                .map(procedureMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProcedureResponse getProcedureById(Long id) {
        Procedure procedure = procedureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Процедура по id " + id + " не найдена"));
        return procedureMapper.mapToResponse(procedure);
    }

    public ProcedureResponse updateProcedure(Long id, ProcedureRequest request) {
        Procedure procedure = procedureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Процедура по id " + id + " не найдена"));
        procedureMapper.ProcedureUpdateEntity(request, procedure);
        Procedure updated = procedureRepository.save(procedure);
        return procedureMapper.mapToResponse(updated);
    }

    public void deleteProcedure(Long id) {
        procedureRepository.deleteById(id);
    }

    public List<ProcedureResponse> findByCategory(String categoryName) {
        Categories category = categoryRepository.findByCategory(categoryName)
                .orElseThrow(()-> new RuntimeException("Категория не найдена"));

        return procedureRepository.findByCategory(category)
                .stream()
                .map(procedureMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProcedureResponse> findByActive(Boolean active) {
        return procedureRepository.findByActive(active)
                .stream()
                .map(procedureMapper::mapToResponse)
                .collect(Collectors.toList());
    }
}
