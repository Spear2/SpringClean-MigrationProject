package com.project.SpringClean.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TransactionHistoryResponse {
    private Long paymentId;
    private Long bookingId;
    private Double amount;
    private String method;
    private String status;
    private LocalDateTime paidAt;

    // Additional booking details (optional but very useful)
    private String serviceType;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private Double totalPrice;
}
