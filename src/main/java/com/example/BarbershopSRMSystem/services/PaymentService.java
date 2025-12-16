package com.example.BarbershopSRMSystem.services;

import com.example.BarbershopSRMSystem.dto.reponses.PaymentResponse;
import com.example.BarbershopSRMSystem.dto.reponses.BarberRevenueResponse;
import com.example.BarbershopSRMSystem.dto.reponses.RevenueResponse;
import com.example.BarbershopSRMSystem.dto.requests.PaymentCreateRequest;
import com.example.BarbershopSRMSystem.entities.Booking;
import com.example.BarbershopSRMSystem.entities.Payment;
import com.example.BarbershopSRMSystem.enums.BookingStatus;
import com.example.BarbershopSRMSystem.enums.PaymentMethod;
import com.example.BarbershopSRMSystem.enums.PaymentStatus;
import com.example.BarbershopSRMSystem.repositories.BookingRepository;
import com.example.BarbershopSRMSystem.repositories.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public PaymentResponse createPayment(PaymentCreateRequest request) {
        if (request.getBookingId() == null) {
            throw new RuntimeException("bookingId обязателен");
        }
        final long bookingId = request.getBookingId();
        if (request.getMethod() == null || request.getMethod().isBlank()) {
            throw new RuntimeException("method обязателен");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Запись не найдена"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Нельзя принять оплату за отмененную запись");
        }

        if (paymentRepository.existsByBookingAndStatus(booking, PaymentStatus.PAID)) {
            throw new RuntimeException("Оплата по этой записи уже принята");
        }

        BigDecimal amount = booking.getFinalAmount();
        if (amount == null) {
            amount = booking.getProcedure() != null ? booking.getProcedure().getPrice() : null;
        }
        if (amount == null) {
            throw new RuntimeException("Не рассчитана итоговая сумма записи");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Некорректная сумма оплаты");
        }

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(amount);
        try {
            payment.setMethod(PaymentMethod.valueOf(request.getMethod()));
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Некорректный метод оплаты");
        }
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());

        Payment saved = paymentRepository.save(payment);
        return mapToResponse(saved);
    }

    public RevenueResponse getRevenue(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new RuntimeException("startDate и endDate обязательны");
        }
        if (endDate.isBefore(startDate)) {
            throw new RuntimeException("endDate не может быть раньше startDate");
        }

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime endExclusive = endDate.plusDays(1).atStartOfDay();

        BigDecimal total = paymentRepository.sumPaidForPeriod(start, endExclusive);
        long count = paymentRepository.countPaidForPeriod(start, endExclusive);

        return new RevenueResponse(startDate.toString(), endDate.toString(), total, count);
    }

    public List<PaymentResponse> getPayments(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new RuntimeException("startDate и endDate обязательны");
        }
        if (endDate.isBefore(startDate)) {
            throw new RuntimeException("endDate не может быть раньше startDate");
        }

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime endExclusive = endDate.plusDays(1).atStartOfDay();

        return paymentRepository.findPaidForPeriod(start, endExclusive)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BarberRevenueResponse> getRevenueByBarber(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new RuntimeException("startDate и endDate обязательны");
        }
        if (endDate.isBefore(startDate)) {
            throw new RuntimeException("endDate не может быть раньше startDate");
        }

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime endExclusive = endDate.plusDays(1).atStartOfDay();

        return paymentRepository.revenueByBarberForPeriod(start, endExclusive)
                .stream()
                .map(row -> {
                    Long barberId = (Long) row[0];
                    String barberName = (String) row[1];
                    BigDecimal total = (BigDecimal) row[2];
                    long count = ((Number) row[3]).longValue();
                    return new BarberRevenueResponse(barberId, barberName, total, count);
                })
                .collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(Payment p) {
        return new PaymentResponse(
                p.getId(),
                p.getBooking().getId(),
                p.getAmount(),
                p.getMethod().name(),
                p.getStatus().name(),
                p.getPaidAt()
        );
    }
}
