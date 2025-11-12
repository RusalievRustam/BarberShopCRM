package com.example.BarbershopSRMSystem.services;


import com.example.BarbershopSRMSystem.dto.reponses.BookingResponse;
import com.example.BarbershopSRMSystem.dto.reponses.ClientResponse;
import com.example.BarbershopSRMSystem.dto.requests.BookingRequest;
import com.example.BarbershopSRMSystem.entities.Booking;
import com.example.BarbershopSRMSystem.entities.Procedure;
import com.example.BarbershopSRMSystem.enums.BookingStatus;
import com.example.BarbershopSRMSystem.mapping.BookingMapper;
import com.example.BarbershopSRMSystem.repositories.BookingRepository;
import com.example.BarbershopSRMSystem.repositories.ClientRepository;
import com.example.BarbershopSRMSystem.repositories.ProcedureRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    private final BookingMapper bookingMapper;

    public BookingResponse createBooking(BookingRequest request) {
        Booking booking = bookingMapper.mapToEntity(request);
        Booking saved = bookingRepository.save(booking);
        return bookingMapper.mapToResponse(saved);
    }

    public BookingResponse updateBooking(Long id, BookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));
        bookingMapper.updateEntityFromRequest(request, booking);
        return bookingMapper.mapToResponse(booking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(bookingMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));
        return bookingMapper.mapToResponse(booking);
    }

    public List<BookingResponse> getBookingByBarber(String barber) {
        return bookingRepository.findByBarberFirstName(barber)
                .stream()
                .map(bookingMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingByClient(String client) {
        return bookingRepository.findByClientFirstName(client)
                .stream()
                .map(bookingMapper::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        return bookingMapper.mapToResponse(booking);
    }

    public BookingResponse rescheduleBooking(Long id, LocalDateTime newStartTime) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));

        Procedure procedure = booking.getProcedure();
        booking.setStartTime(newStartTime);
        booking.setEndTime(newStartTime.plusMinutes(procedure.getDuration()));

        booking.setStatus(BookingStatus.RESCHEDULED);
        bookingRepository.save(booking);
        return bookingMapper.mapToResponse(booking);
    }

    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Запись не найдена");
        }
        bookingRepository.deleteById(id);
    }
}