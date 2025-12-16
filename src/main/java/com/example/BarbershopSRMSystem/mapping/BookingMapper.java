package com.example.BarbershopSRMSystem.mapping;

import com.example.BarbershopSRMSystem.dto.reponses.BookingResponse;
import com.example.BarbershopSRMSystem.dto.requests.BookingRequest;
import com.example.BarbershopSRMSystem.entities.Booking;
import com.example.BarbershopSRMSystem.enums.BookingStatus;
import com.example.BarbershopSRMSystem.enums.DiscountType;
import com.example.BarbershopSRMSystem.services.BarberService;
import com.example.BarbershopSRMSystem.services.ClientService;
import com.example.BarbershopSRMSystem.services.ProcedureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

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
        booking.setBarber(barberService.getBarberEntityById(request.getBarberId()));
        booking.setProcedure(procedureService.getProcedureEntityById(request.getProcedureId()));
        booking.setStartTime(request.getStartTime());
        booking.setStatus(BookingStatus.valueOf(request.getStatus()));

        booking.setEndTime(request.getStartTime().plusMinutes(booking.getProcedure().getDuration()));

        DiscountType discountType = null;
        if (request.getDiscountType() != null && !request.getDiscountType().isBlank()) {
            discountType = DiscountType.valueOf(request.getDiscountType());
        }
        booking.setDiscountType(discountType);
        booking.setDiscountValue(request.getDiscountValue());
        booking.setFinalAmount(calculateFinalAmount(booking.getProcedure().getPrice(), discountType, request.getDiscountValue()));
    }

    private BigDecimal calculateFinalAmount(BigDecimal basePrice, DiscountType discountType, BigDecimal discountValue) {
        if (basePrice == null) return null;

        BigDecimal result = basePrice;
        if (discountType != null && discountValue != null) {
            if (discountType == DiscountType.PERCENT) {
                BigDecimal hundred = new BigDecimal("100");
                BigDecimal percent = discountValue;
                if (percent.compareTo(BigDecimal.ZERO) < 0) percent = BigDecimal.ZERO;
                if (percent.compareTo(hundred) > 0) percent = hundred;
                result = basePrice.multiply(hundred.subtract(percent)).divide(hundred, 2, RoundingMode.HALF_UP);
            } else if (discountType == DiscountType.FIXED) {
                BigDecimal fixed = discountValue;
                if (fixed.compareTo(BigDecimal.ZERO) < 0) fixed = BigDecimal.ZERO;
                result = basePrice.subtract(fixed);
            }
        }

        if (result.compareTo(BigDecimal.ZERO) < 0) result = BigDecimal.ZERO;
        return result.setScale(2, RoundingMode.HALF_UP);
    }

    public BookingResponse mapToResponse(Booking booking) {
        BigDecimal finalAmount = booking.getFinalAmount();
        if (finalAmount == null) {
            finalAmount = calculateFinalAmount(
                    booking.getProcedure() != null ? booking.getProcedure().getPrice() : null,
                    booking.getDiscountType(),
                    booking.getDiscountValue()
            );
        }
        return new BookingResponse(
                booking.getId(),
                booking.getClient().getFirstName(),
                booking.getClient().getId(),
                booking.getBarber().getFirstName(),
                booking.getBarber().getId(),
                booking.getProcedure().getProcedureName(),
                booking.getDiscountType() != null ? booking.getDiscountType().name() : null,
                booking.getDiscountValue(),
                finalAmount,
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus().name()
        );
    }
}
