package com.example.BarbershopSRMSystem.services;

import com.example.BarbershopSRMSystem.dto.reponses.BarberAvailabilityResponse;
import com.example.BarbershopSRMSystem.dto.reponses.BarberResponse;
import com.example.BarbershopSRMSystem.dto.requests.BarberAvailabilityRequest;
import com.example.BarbershopSRMSystem.dto.requests.BarberRequest;
import com.example.BarbershopSRMSystem.entities.*;
import com.example.BarbershopSRMSystem.enums.BookingStatus;
import com.example.BarbershopSRMSystem.mapping.BarberMapper;
import com.example.BarbershopSRMSystem.repositories.BarberRepository;
import com.example.BarbershopSRMSystem.repositories.BookingRepository;
import com.example.BarbershopSRMSystem.repositories.WorkScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class BarberService {

    private static final int DEFAULT_APPOINTMENT_DURATION_MINUTES = 60;
    private static final int SLOT_DURATION_MINUTES = 30;

    private final BarberRepository barberRepository;
    private final WorkScheduleRepository workScheduleRepository;
    private final BookingRepository bookingRepository;
    private final BarberMapper barberMapper;

    public BarberResponse createBarber(BarberRequest request) {
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

    public BarberResponse getBarberById(Long id) {
        return barberMapper.mapToResponse(getBarberEntityById(id));
    }

    public Barber getBarberEntityById(Long id) {
        return barberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Barber with id " + id + " not found!"));
    }

    @Transactional
    public BarberResponse updateBarber(BarberRequest request, Long id) {
        Barber barber = getBarberEntityById(id);
        barberMapper.updateEntityFromRequest(request, barber);
        barberRepository.save(barber);
        return barberMapper.mapToResponse(barber);
    }

    @Transactional
    public void deleteBarber(Long id) {
        barberRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<BarberAvailabilityResponse> getBarberAvailability(Long barberId, LocalDate date) {
        Barber barber = getBarberEntityById(barberId);
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        
        // Get work schedule for the day
        Optional<WorkSchedule> workScheduleOpt = workScheduleRepository
                .findByBarberAndDayOfWeek(barber, dayOfWeek);
        
        if (workScheduleOpt.isEmpty() || !workScheduleOpt.get().getActive()) {
            return Collections.emptyList();
        }

        WorkSchedule schedule = workScheduleOpt.get();
        List<BarberAvailabilityResponse> availability = new ArrayList<>();
        
        // Get all bookings for the day
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        List<Booking> bookings = bookingRepository.findByBarberAndStartTimeBetween(
                barber, startOfDay, endOfDay);
        
        // Convert work schedule to time slots
        LocalTime current = schedule.getStartTime();
        while (current.isBefore(schedule.getEndTime())) {
            LocalTime slotEnd = current.plusMinutes(SLOT_DURATION_MINUTES);
            if (slotEnd.isAfter(schedule.getEndTime())) {
                break;
            }
            
            BarberAvailabilityResponse slot = new BarberAvailabilityResponse();
            slot.setBarberId(barberId);
            slot.setDayOfWeek(dayOfWeek);
            slot.setStartTime(current);
            slot.setEndTime(slotEnd);
            
            // Check if slot is booked
            LocalDateTime slotStartDateTime = date.atTime(current);
            LocalDateTime slotEndDateTime = date.atTime(slotEnd);
            
            boolean isBooked = bookings.stream()
                    .anyMatch(booking -> 
                            !booking.getEndTime().isBefore(slotStartDateTime) && 
                            !booking.getStartTime().isAfter(slotEndDateTime) &&
                            booking.getStatus() != BookingStatus.CANCELLED);
            
            slot.setAvailable(!isBooked);
            availability.add(slot);
            
            current = slotEnd;
        }
        
        return availability;
    }

    @Transactional
    public void setBarberAvailability(Long barberId, BarberAvailabilityRequest request) {
        Barber barber = getBarberEntityById(barberId);
        
        Optional<WorkSchedule> existingSchedule = workScheduleRepository
                .findByBarberAndDayOfWeek(barber, request.getDayOfWeek());
        
        if (request.isAvailable()) {
            WorkSchedule schedule = existingSchedule.orElseGet(WorkSchedule::new);
            schedule.setBarber(barber);
            schedule.setDayOfWeek(request.getDayOfWeek());
            schedule.setStartTime(request.getStartTime());
            schedule.setEndTime(request.getEndTime());
            schedule.setActive(true);
            workScheduleRepository.save(schedule);
        } else if (existingSchedule.isPresent()) {
            workScheduleRepository.delete(existingSchedule.get());
        }
    }

    @Transactional(readOnly = true)
    public List<LocalTime> getAvailableTimeSlots(Long barberId, LocalDate date, Integer durationMinutes) {
        int duration = durationMinutes != null ? durationMinutes : DEFAULT_APPOINTMENT_DURATION_MINUTES;
        
        // Get work schedule for the day
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        Barber barber = getBarberEntityById(barberId);
        
        Optional<WorkSchedule> workScheduleOpt = workScheduleRepository
                .findByBarberAndDayOfWeek(barber, dayOfWeek);
        
        if (workScheduleOpt.isEmpty() || !workScheduleOpt.get().getActive()) {
            return Collections.emptyList();
        }
        
        WorkSchedule schedule = workScheduleOpt.get();
        
        // Get all bookings for the day
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        List<Booking> bookings = bookingRepository.findByBarberAndStartTimeBetween(
                barber, startOfDay, endOfDay);
        
        // Generate time slots
        List<LocalTime> availableSlots = new ArrayList<>();
        LocalTime current = schedule.getStartTime();
        LocalTime endTime = schedule.getEndTime().minusMinutes(duration);
        
        while (!current.plusMinutes(duration).isAfter(endTime)) {
            LocalTime slotEnd = current.plusMinutes(duration);
            LocalDateTime slotStartDateTime = date.atTime(current);
            LocalDateTime slotEndDateTime = date.atTime(slotEnd);
            
            // Check if slot is available
            boolean isBooked = bookings.stream()
                    .anyMatch(booking -> 
                            !booking.getEndTime().isBefore(slotStartDateTime) && 
                            !booking.getStartTime().isAfter(slotEndDateTime) &&
                            booking.getStatus() != BookingStatus.CANCELLED);
            
            if (!isBooked) {
                availableSlots.add(current);
            }
            
            current = current.plusMinutes(SLOT_DURATION_MINUTES);
        }
        
        return availableSlots;
    }

    @Transactional(readOnly = true)
    public List<BarberAvailabilityResponse> getBarberWeeklySchedule(Long barberId) {
        Barber barber = getBarberEntityById(barberId);
        List<WorkSchedule> weeklySchedule = workScheduleRepository.findByBarber(barber);
        
        return weeklySchedule.stream()
                .map(schedule -> {
                    BarberAvailabilityResponse response = new BarberAvailabilityResponse();
                    response.setBarberId(barberId);
                    response.setDayOfWeek(schedule.getDayOfWeek());
                    response.setStartTime(schedule.getStartTime());
                    response.setEndTime(schedule.getEndTime());
                    response.setAvailable(schedule.getActive());
                    return response;
                })
                .collect(Collectors.toList());
    }
}
