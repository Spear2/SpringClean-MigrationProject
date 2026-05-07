package com.project.SpringClean.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class PaymentResponse {
    private Long paymentId;
    private double amount;
    private String status;
    private LocalDateTime paidAt;

    // Booking info
    private Long bookingId;

    // Customer info
    private String customerFirstName;
    private String customerLastName;

    public PaymentResponse(Long paymentId, double amount, String status, LocalDateTime paidAt,
                              Long bookingId, String customerFirstName, String customerLastName) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.status = status;
        this.paidAt = paidAt;
        this.bookingId = bookingId;
        this.customerFirstName = customerFirstName;
        this.customerLastName = customerLastName;
    }
}
