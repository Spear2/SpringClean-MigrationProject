package com.project.SpringClean.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long walletId;

    private double balance = 1000000;

    @OneToOne
    @JoinColumn(name = "customerId", nullable = false)
    @JsonBackReference
    private Customer customer;
}
