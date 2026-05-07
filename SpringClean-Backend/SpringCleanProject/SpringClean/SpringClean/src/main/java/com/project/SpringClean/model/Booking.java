package com.project.SpringClean.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "customerId", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "companyCleanerId", nullable = false)
    private CompanyCleaner companyCleaner;

    @ManyToMany
    // @JsonBackReference
    @JoinTable(
            name = "booking_cleaners",
            joinColumns = @JoinColumn(name = "booking_id"),
            inverseJoinColumns = @JoinColumn(name = "cleaner_id")
    )
private Set<Cleaner> assignedCleaners = new HashSet<>();

    private String serviceType;
    private String address;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private Integer hours;
    private Integer minutes;
    private String status;
    private Double totalPrice;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean paid;
}