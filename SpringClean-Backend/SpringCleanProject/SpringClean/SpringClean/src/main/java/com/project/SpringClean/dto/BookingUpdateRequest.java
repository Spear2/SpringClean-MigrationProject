package com.project.SpringClean.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class BookingUpdateRequest {
    private String bookingDate;
    private String bookingTime;
}