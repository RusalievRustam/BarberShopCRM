package com.example.BarbershopSRMSystem.mapping;

import com.example.BarbershopSRMSystem.dto.reponses.BarberResponse;
import com.example.BarbershopSRMSystem.dto.requests.BarberRequest;
import com.example.BarbershopSRMSystem.entities.Barber;
import com.example.BarbershopSRMSystem.entities.User;
import com.example.BarbershopSRMSystem.services.DatabaseUserDetailsService;
import org.springframework.stereotype.Component;

@Component
public class BarberMapper {

    private final DatabaseUserDetailsService userService;

    public BarberMapper(DatabaseUserDetailsService userService) {
        this.userService = userService;
    }

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
        barber.setStatus(request.getStatus());

        // Получаем сущность User по id
        User user = userService.getUserById(request.getUserId());
        barber.setUser(user);
    }

    public BarberResponse mapToResponse(Barber barber) {
        return new BarberResponse(
                barber.getId(),
                barber.getFirstName(),
                barber.getLastName(),
                barber.getPhone(),
                barber.getHireDate(),
                barber.getStatus(),
                barber.getUser() != null ? barber.getUser().getId() : null
        );
    }
}