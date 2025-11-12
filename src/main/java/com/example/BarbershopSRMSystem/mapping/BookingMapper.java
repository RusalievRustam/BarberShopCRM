package com.example.BarbershopSRMSystem.mapping;

import com.example.BarbershopSRMSystem.dto.reponses.BookingResponse;
import com.example.BarbershopSRMSystem.dto.requests.BookingRequest;
import com.example.BarbershopSRMSystem.entities.Booking;
import com.example.BarbershopSRMSystem.enums.BookingStatus;
import com.example.BarbershopSRMSystem.services.BarberService;
import com.example.BarbershopSRMSystem.services.ClientService;
import com.example.BarbershopSRMSystem.services.ProcedureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingMapper {
    private final ClientService clientService;
    private final BarberService barberService;
    private final ProcedureService procedureService;

    public Booking mapToEntity(BookingRequest request) {
        Booking booking = new Booking();
        applyRequestToEntity(request, booking);
        return booking;
    }

    public void updateEntityFromRequest(BookingRequest request, Booking booking) {
        applyRequestToEntity(request, booking);
    }

    public void applyRequestToEntity(BookingRequest request, Booking booking) {
        booking.setClient(clientService.getClientEntityById(request.getClientId()));
        booking.setBarber(barberService.getBarberById(request.getBarberId()));
        booking.setProcedure(procedureService.getProcedureEntityById(request.getProcedureId()));
        booking.setStartTime(request.getStartTime());
        booking.setStatus(BookingStatus.valueOf(request.getStatus()));

        booking.setEndTime(request.getStartTime().plusMinutes(procedureService.getProcedureById(request.getProcedureId()).getDuration()));
    }

    public BookingResponse mapToResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getClient().getFirstName(),
                booking.getBarber().getFirstName(),
                booking.getProcedure().getProcedureName(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus().name()
        );
    }
}
