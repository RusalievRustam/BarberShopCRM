package com.example.BarbershopSRMSystem.services;

import com.example.BarbershopSRMSystem.entities.Barber;
import com.example.BarbershopSRMSystem.repositories.BarberRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class BarberService {

    BarberRepository barberRepository;

    public Barber createBarber(Barber barber) {
        return barberRepository.save(barber);
    }

    public List<Barber> getAllBarbers() {
        return barberRepository.findAll();
    }

    public Barber getBarberById(Long id) {
        return barberRepository.findById(id).
                orElseThrow(() -> new RuntimeException("Barber by id" + id + " not found!"));
    }

    public Barber updateBarber(Barber updatedBarber) {
        Barber existingBarber = getBarberById(updatedBarber.getId());
        existingBarber.setFirst_name(updatedBarber.getFirst_name());
        existingBarber.setLast_name(updatedBarber.getLast_name());
        existingBarber.setPhone(updatedBarber.getPhone());
        existingBarber.setStatus(updatedBarber.getStatus());
        return barberRepository.save(existingBarber);
    }

    public void deleteBarber(Long id) {
        barberRepository.deleteById(id);
    }


}
