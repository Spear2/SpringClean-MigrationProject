package com.project.SpringClean.service;

import com.project.SpringClean.dto.PaymentRequest;
import com.project.SpringClean.dto.PaymentResponse;
import com.project.SpringClean.dto.TransactionHistoryResponse;
import com.project.SpringClean.model.Booking;
import com.project.SpringClean.model.Customer;
import com.project.SpringClean.model.Payment;
import com.project.SpringClean.repository.BookingRepository;
import com.project.SpringClean.repository.CustomerRepository;
import com.project.SpringClean.repository.PaymentRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepo;

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private WalletService walletService;

    public Payment createPayment(PaymentRequest request, Long customerId) {

        Booking booking = bookingRepo.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getCustomer().getCustomerId().equals(customerId)) {
            throw new RuntimeException("Booking does not belong to this customer");
        }

        if ("Paid".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("Booking is already paid");
        }

        double amount = booking.getTotalPrice();
        walletService.deductBalance(customerId, amount);

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(amount);
        payment.setMethod(request.getMethod());
        payment.setStatus("Paid");
        payment.setPaidAt(LocalDateTime.now());

        booking.setStatus("Paid");
        bookingRepo.save(booking);
        return paymentRepo.save(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByCompany(Long companyCleanerId) {

        // 1. Fetch all bookings for the company
        List<Booking> bookings =
                bookingRepo.findByCompanyCleaner_CompanyCleanerId(companyCleanerId);

        // 2. Convert each booking into 0..N payment responses
        List<PaymentResponse> responses = new ArrayList<>();

        for (Booking booking : bookings) {

            List<Payment> payments =
                    paymentRepo.findByBooking_BookingId(booking.getBookingId());

            Customer customer = booking.getCustomer();
            String firstName = customer != null ? customer.getFirstName() : "";
            String lastName = customer != null ? customer.getLastName() : "";

            for (Payment payment : payments) {
                responses.add(new PaymentResponse(
                        payment.getPaymentId(),
                        payment.getAmount(),
                        payment.getStatus(),
                        payment.getPaidAt(),
                        booking.getBookingId(),
                        firstName,
                        lastName
                ));
            }
        }

        return responses;
    }

    public TransactionHistoryResponse toDTO(Payment payment) {
        Booking booking = payment.getBooking();

        TransactionHistoryResponse dto = new TransactionHistoryResponse();
        dto.setPaymentId(payment.getPaymentId());
        dto.setBookingId(booking.getBookingId());
        dto.setAmount(payment.getAmount());
        dto.setMethod(payment.getMethod());
        dto.setStatus(payment.getStatus());
        dto.setPaidAt(payment.getPaidAt());

        dto.setServiceType(booking.getServiceType());
        dto.setBookingDate(booking.getBookingDate());
        dto.setBookingTime(booking.getBookingTime());
        dto.setTotalPrice(booking.getTotalPrice());
        return dto;
    }

}
