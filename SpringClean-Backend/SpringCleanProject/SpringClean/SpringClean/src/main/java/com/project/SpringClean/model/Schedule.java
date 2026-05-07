package com.project.SpringClean.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    @ManyToOne
    @JoinColumn(name = "companyCleanerId", nullable = false)
    private CompanyCleaner companyCleaner;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int duration; // minutes or hours
}
