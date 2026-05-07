package com.project.SpringClean.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Setter
@Getter
public class Reviews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reviewFor; // "company" or "cleaner"

    @ManyToOne
    @JoinColumn(name = "companyCleanerId", nullable = true)
    private CompanyCleaner company;

    @ManyToOne
    @JoinColumn(name = "cleanerId", nullable = true)
    private Cleaner cleaner;

    @ManyToOne
    @JoinColumn(name = "customerId")
    private Customer customer;

    private int rating;

    @Column(columnDefinition = "TEXT")
    private String text;

    private String imageUrl;

    private LocalDate date;
    private LocalTime time;
}

