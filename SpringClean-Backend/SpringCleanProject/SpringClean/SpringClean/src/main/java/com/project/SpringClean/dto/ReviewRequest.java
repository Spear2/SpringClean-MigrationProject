package com.project.SpringClean.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class ReviewRequest {
    private String reviewFor;
    private Long companyId;
    private Long cleanerId;
    private int rating;
    private String text;
    private Long customerId;
}

