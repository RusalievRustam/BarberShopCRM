package com.example.BarbershopSRMSystem.services;


import com.example.BarbershopSRMSystem.entities.Booking;
import com.example.BarbershopSRMSystem.repositories.BookingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class BookingService {

    BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).
                orElseThrow(() -> new RuntimeException("Booking by id " + id + " not found!"));
    }

    public Booking updateBooking(Booking updatedBooking) {
        Booking existingBooking = getBookingById(updatedBooking.getId());
        existingBooking.setClient(updatedBooking.getClient());
        existingBooking.setBarber(updatedBooking.getBarber());
        existingBooking.setProcedure(updatedBooking.getProcedure());
        existingBooking.setStatus(updatedBooking.getStatus());
        existingBooking.setDateTime(updatedBooking.getDateTime());
        return bookingRepository.save(existingBooking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
