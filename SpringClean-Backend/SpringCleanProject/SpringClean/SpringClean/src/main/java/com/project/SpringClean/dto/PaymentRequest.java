package com.project.SpringClean.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Data
@Getter
public class PaymentRequest {
    private Long bookingId;
    private double amount;
    private String method;
}