package com.example.BarbershopSRMSystem.services;

import com.example.BarbershopSRMSystem.dto.reponses.BarberResponse;
import com.example.BarbershopSRMSystem.dto.requests.BarberRequest;
import com.example.BarbershopSRMSystem.entities.Barber;
import com.example.BarbershopSRMSystem.mapping.BarberMapper;
import com.example.BarbershopSRMSystem.repositories.BarberRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BarberService {

    private final BarberRepository barberRepository;
    private final BarberMapper barberMapper;


    public BarberResponse createBarber(BarberRequest request){
        Barber barber = barberMapper.mapToEntity(request);
        Barber saved = barberRepository.save(barber);
        return barberMapper.mapToResponse(saved);
    }

    public List<BarberResponse> getAllBarbers() {
        return barberRepository.findAll()
                .stream()
                .map(barberMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public Barber getBarberById(Long id) {
        return barberRepository.findById(id).
                orElseThrow(() -> new RuntimeException("Barber by id" + id + " not found!"));
    }

    public Barber updateBarber(Barber updatedBarber) {
        Barber existingBarber = getBarberById(updatedBarber.getId());
        existingBarber.setFirstName(updatedBarber.getFirstName());
        existingBarber.setLastName(updatedBarber.getLastName());
        existingBarber.setPhone(updatedBarber.getPhone());
        existingBarber.setStatus(updatedBarber.getStatus());
        return barberRepository.save(existingBarber);
    }

    public void deleteBarber(Long id) {
        barberRepository.deleteById(id);
    }


}
