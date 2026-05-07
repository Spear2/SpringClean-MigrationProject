package com.project.SpringClean.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Getter
@Setter
public class BookingRequest {
    private Long companyCleanerId;
    private String serviceType;
    private String address;
    private String date; // ISO yyyy-MM-dd
    private String time; // HH:mm
    private Integer hours;
    private Integer minutes;
    private double totalPrice;
    private boolean payNow;
}