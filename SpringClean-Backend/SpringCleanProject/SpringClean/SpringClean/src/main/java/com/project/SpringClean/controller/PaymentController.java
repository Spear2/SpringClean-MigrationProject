package com.project.SpringClean.controller;


import com.project.SpringClean.dto.PaymentRequest;
import com.project.SpringClean.dto.PaymentResponse;
import com.project.SpringClean.dto.TransactionHistoryResponse;
import com.project.SpringClean.model.Booking;
import com.project.SpringClean.model.Payment;
import com.project.SpringClean.repository.PaymentRepository;
import com.project.SpringClean.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/{customerId}")
    public ResponseEntity<?> makePayment(@PathVariable Long customerId, @RequestBody PaymentRequest request) {
        try {
            Payment payment = paymentService.createPayment(request, customerId);
            return ResponseEntity.ok(paymentService.toDTO(payment));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/company/{companyCleanerId}/payments")
    public ResponseEntity<List<PaymentResponse>> getCompanyPayments(
            @PathVariable Long companyCleanerId) {
        List<PaymentResponse> payments = paymentService.getPaymentsByCompany(companyCleanerId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/customer/{customerId}")
    public List<TransactionHistoryResponse> getHistory(@PathVariable Long customerId){
        List<Payment> payments = paymentRepository.findByBookingCustomerCustomerId(customerId);
        return payments.stream()
                .map(paymentService::toDTO)
                .collect(Collectors.toList());
    }

}