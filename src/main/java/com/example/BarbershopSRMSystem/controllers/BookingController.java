package com.example.BarbershopSRMSystem.controllers;

import com.example.BarbershopSRMSystem.dto.reponses.BookingResponse;
import com.example.BarbershopSRMSystem.dto.requests.BookingRequest;
import com.example.BarbershopSRMSystem.dto.requests.RescheduleRequest;
import com.example.BarbershopSRMSystem.entities.Booking;
import com.example.BarbershopSRMSystem.services.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/booking")
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getALlBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> updateBooking(@RequestBody BookingRequest request, @PathVariable Long id) {
        return ResponseEntity.ok(bookingService.updateBooking(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/search/byBarber")
    public ResponseEntity<List<BookingResponse>> getByBarber(@RequestParam String barberName) {
        return ResponseEntity.ok(bookingService.getBookingByBarber(barberName));
    }

    @GetMapping("/search/byClient")
    public ResponseEntity<List<BookingResponse>> getByClient(@RequestParam String clientName) {
        return ResponseEntity.ok(bookingService.getBookingByClient(clientName));
    }

    @PatchMapping("/cancel/{id}")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @PatchMapping("/reschedule/{id}")
    public ResponseEntity<BookingResponse> rescheduleBooking(@PathVariable Long id, @RequestBody RescheduleRequest rescheduleRequest) {
        return ResponseEntity.ok(bookingService.rescheduleBooking(id, rescheduleRequest.getNewStartTime()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Booking> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
