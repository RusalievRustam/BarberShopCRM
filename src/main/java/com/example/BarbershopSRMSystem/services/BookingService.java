package com.example.BarbershopSRMSystem.services;


import com.example.BarbershopSRMSystem.dto.reponses.BookingResponse;
import com.example.BarbershopSRMSystem.dto.requests.BookingRequest;
import com.example.BarbershopSRMSystem.entities.Booking;
import com.example.BarbershopSRMSystem.entities.Procedure;
import com.example.BarbershopSRMSystem.entities.WorkSchedule;
import com.example.BarbershopSRMSystem.enums.BookingStatus;
import com.example.BarbershopSRMSystem.mapping.BookingMapper;
import com.example.BarbershopSRMSystem.repositories.BarberRepository;
import com.example.BarbershopSRMSystem.repositories.BookingRepository;
import com.example.BarbershopSRMSystem.repositories.WorkScheduleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    private final BookingMapper bookingMapper;

    private final BarberRepository barberRepository;
    private final WorkScheduleRepository workScheduleRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // Блокируем барбера на время создания записи, чтобы избежать гонок
        barberRepository.findByIdForUpdate(request.getBarberId())
                .orElseThrow(() -> new RuntimeException("Барбер не найден"));

        Booking booking = bookingMapper.mapToEntity(request);

        if (booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new RuntimeException("Некорректное время записи");
        }

        if (booking.getStartTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Нельзя записаться на прошедшее время");
        }

        // Проверяем, что барбер работает в этот день и в это время
        Optional<WorkSchedule> wsOpt = workScheduleRepository.findByBarberAndDayOfWeek(
                booking.getBarber(),
                booking.getStartTime().getDayOfWeek()
        );

        if (wsOpt.isEmpty() || !Boolean.TRUE.equals(wsOpt.get().getActive())) {
            throw new RuntimeException("Барбер не работает в выбранный день");
        }

        WorkSchedule ws = wsOpt.get();
        if (booking.getStartTime().toLocalTime().isBefore(ws.getStartTime())
                || booking.getEndTime().toLocalTime().isAfter(ws.getEndTime())) {
            throw new RuntimeException("Выбранное время вне рабочего графика барбера");
        }

        // Проверяем пересечения с существующими записями (любой статус кроме CANCELLED)
        List<Booking> overlaps = bookingRepository.findOverlappingActiveBookings(
                booking.getBarber(),
                booking.getStartTime(),
                booking.getEndTime()
        );
        if (!overlaps.isEmpty()) {
            throw new RuntimeException("Это время уже занято");
        }

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.mapToResponse(saved);
    }

    public BookingResponse updateBooking(Long id, BookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));
        bookingMapper.updateEntityFromRequest(request, booking);
        bookingRepository.save(booking);
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