package com.project.SpringClean.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewResponse {

    private Long reviewId;

    private String reviewFor;     // "company" or "cleaner"
    private String companyName;   // optional
    private String cleanerName;   // optional
    private Long cleanerId;

    private Long customerId;
    private String customerName;  // <-- added because Review entity doesn't store name

    private int rating;
    private String text;
    private String imageUrl;

    private String date; // formatted string
    private String time; // formatted string
}
