package com.example.BarbershopSRMSystem.mapping;

import com.example.BarbershopSRMSystem.dto.reponses.BarberResponse;
import com.example.BarbershopSRMSystem.dto.requests.BarberRequest;
import com.example.BarbershopSRMSystem.entities.Barber;
import com.example.BarbershopSRMSystem.enums.Status;
import org.springframework.stereotype.Component;

@Component
public class BarberMapper {

    public Barber mapToEntity(BarberRequest request) {
        Barber barber = new Barber();
        applyRequestToEntity(request, barber);
        return barber;
    }

    public void updateEntityFromRequest(BarberRequest request, Barber barber) {
        applyRequestToEntity(request, barber);
    }

    private void applyRequestToEntity(BarberRequest request, Barber barber) {
        barber.setFirstName(request.getFirstName());
        barber.setLastName(request.getLastName());
        barber.setPhone(request.getPhone());
        barber.setStatus(Status.valueOf(String.valueOf(request.getStatus())));

    }

    public BarberResponse mapToResponse(Barber barber) {
        return new BarberResponse(
                barber.getId(),
                barber.getFirstName(),
                barber.getLastName(),
                barber.getPhone(),
                barber.getHireDate(),
                barber.getStatus()
        );
    }
}