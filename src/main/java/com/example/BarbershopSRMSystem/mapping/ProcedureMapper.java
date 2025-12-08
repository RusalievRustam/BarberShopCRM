package com.example.BarbershopSRMSystem.mapping;

import com.example.BarbershopSRMSystem.dto.reponses.CategoryResponse;
import com.example.BarbershopSRMSystem.dto.reponses.ProcedureResponse;
import com.example.BarbershopSRMSystem.dto.requests.ProcedureRequest;
import com.example.BarbershopSRMSystem.entities.Categories;
import com.example.BarbershopSRMSystem.entities.Procedure;
import com.example.BarbershopSRMSystem.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProcedureMapper {

    private final CategoryRepository categoryRepository;

    public Procedure mapToEntity(ProcedureRequest request) {
        Procedure procedure = new Procedure();
        applyRequestToEntity(request,procedure);
        return procedure;
    }

    public void procedureUpdateEntity(ProcedureRequest request, Procedure procedure) {
        applyRequestToEntity(request,procedure);
    }

    private void applyRequestToEntity(ProcedureRequest request, Procedure procedure) {
        procedure.setProcedureName(request.getProcedureName());
        procedure.setDescription(request.getDescription());
        procedure.setDuration(request.getDuration());
        procedure.setPrice(request.getPrice());
        Categories category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Категория не найдена"));
        procedure.setCategory(category);
        procedure.setActive(request.getActive());
    }

    public ProcedureResponse mapToResponse(Procedure procedure){
        CategoryResponse categoryResponse = new CategoryResponse(
                procedure.getCategory().getId(),
                procedure.getCategory().getCategoryName()
        );

        return new ProcedureResponse(
                procedure.getId(),
                procedure.getProcedureName(),
                procedure.getDescription(),
                procedure.getDuration(),
                procedure.getPrice(),
                categoryResponse,
                procedure.getActive()
        );
    }
}
