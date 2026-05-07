package com.project.SpringClean.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Cleaner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cleanerId;

    @ManyToOne
    @JoinColumn(name = "company_cleaner_id")
    @JsonBackReference
    private CompanyCleaner companyCleaner;

    private String cleanerName;
    private String email;
    private String phoneNumber;
    private String address;
    private String password;
    private boolean available = true;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Cleaner)) return false;
        return cleanerId != null && cleanerId.equals(((Cleaner) o).getCleanerId());
    }

    @Override
    public int hashCode() {
        return 31;
    }
}