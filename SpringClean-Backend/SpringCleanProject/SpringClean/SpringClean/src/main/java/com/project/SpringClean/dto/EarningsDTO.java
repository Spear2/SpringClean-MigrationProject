package com.project.SpringClean.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EarningsDTO {
    private Long paymentId;
    private Long bookingId;
    private String customerFirstName;
    private String customerLastName;
    private String serviceType;
    private double totalAmount;
    private double cleanerEarnings; // 80%
    private double companyCommission; // 20%
    private String status;
    private LocalDateTime paidAt;
}