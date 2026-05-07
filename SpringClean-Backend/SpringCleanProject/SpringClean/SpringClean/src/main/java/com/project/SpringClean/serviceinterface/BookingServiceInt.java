package com.project.SpringClean.serviceinterface;

import com.project.SpringClean.dto.BookingRequest;
import com.project.SpringClean.dto.BookingResponse;
import com.project.SpringClean.model.Booking;

import java.util.List;

public interface BookingServiceInt {

    Booking createBooking(BookingRequest request, Long customerId) throws RuntimeException;
    BookingResponse markInProgress(Long bookingId);
    BookingResponse markCompleted(Long bookingId);
}
