package com.project.SpringClean.controller;

import com.project.SpringClean.dto.BookingRequest;
import com.project.SpringClean.dto.BookingResponse;
import com.project.SpringClean.dto.BookingUpdateRequest;
import com.project.SpringClean.model.Booking;
import com.project.SpringClean.model.Customer;
import com.project.SpringClean.repository.BookingRepository;
import com.project.SpringClean.service.BookingService;
import com.project.SpringClean.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

import com.project.SpringClean.dto.AssignCleanersRequest;
import com.project.SpringClean.dto.BookingAssignRequest;


@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/{customerId}")
    public ResponseEntity<?> createBooking(
            @RequestBody BookingRequest request,
            @PathVariable Long customerId
    ) {
        try {
            Booking saved = bookingService.createBooking(request, customerId);
            BookingResponse dto = bookingService.toDTO(saved);
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            ex.printStackTrace(); // <----- ADD THIS
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/customers/{customerId}/bookings")
    public List<BookingResponse> getBookings(@PathVariable Long customerId) {
        return bookingService.getBookingsByCustomer(customerId)
                .stream()
                .map(bookingService::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/company/{companyCleanerId}")
    public List<BookingResponse> getCompanyBookings(@PathVariable Long companyCleanerId) {
        return bookingService.getBookingsByCompany(companyCleanerId)
                            .stream()
                            .map(bookingService::toDTO)
                            .collect(Collectors.toList());
    }


    @GetMapping("/customer/{customerId}")
    public List<Booking> findByCustomer(@PathVariable Long customerId) {
        return bookingRepository.findByCustomer_CustomerId(customerId);
    }

    @PutMapping("/{bookingId}")
    public ResponseEntity<?> updateBooking(
            @PathVariable Long bookingId,
            @RequestBody BookingUpdateRequest req) {

        try {
            Booking updated = bookingService.updateBooking(bookingId, req);
            BookingResponse dto = bookingService.toDTO(updated);
            return ResponseEntity.ok(dto);

        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{bookingId}/{customerId}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId, @PathVariable Long customerId) {

        try {
            bookingService.cancelBooking(bookingId, customerId);
            return ResponseEntity.ok("Booking cancelled");

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Assign cleaners only (without accepting the booking yet)
    @PutMapping("/{bookingId}/assign-cleaners")
    public ResponseEntity<?> assignCleanersOnly(
            @PathVariable Long bookingId,
            @RequestBody AssignCleanersRequest request) {
        BookingResponse resp = bookingService.assignCleanersOnly(bookingId, request.getCleanerIds());
        return ResponseEntity.ok(resp);
    }

    // Accept booking
    @PutMapping("/{bookingId}/accept")
    public ResponseEntity<?> acceptBooking(@PathVariable Long bookingId) {
        BookingResponse resp = bookingService.acceptBookingOnly(bookingId);
        return ResponseEntity.ok(resp);
    }

    // Reject booking
    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable Long bookingId) {
        BookingResponse resp = bookingService.rejectBooking(bookingId);
        return ResponseEntity.ok(resp);
    }

    // Controller
    @PutMapping("/{id}/accept-only")
    public BookingResponse acceptBookingOnly(@PathVariable Long id) {
        return bookingService.acceptBookingOnly(id);
    }

    @PutMapping("/{id}/complete")
    public BookingResponse markCompleted(@PathVariable Long id) {
        return bookingService.markCompleted(id);
    }


    @PutMapping("/{id}/in-progress")
    public BookingResponse markInProgress(@PathVariable Long id) {
        return bookingService.markInProgress(id);
    }

    @GetMapping("/company/{companyId}/bookings")
    public List<BookingResponse> getCompanyBookingsForCalendar(@PathVariable Long companyId) {
        return bookingService.getCompanyBookingsForCalendar(companyId);
    }


}

