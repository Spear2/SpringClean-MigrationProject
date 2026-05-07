package com.project.SpringClean.controller;

import com.project.SpringClean.dto.CustomerLoginRequest;
import com.project.SpringClean.dto.CustomerLoginResponse;
import com.project.SpringClean.dto.CustomerUpdateRequest;
import com.project.SpringClean.model.CompanyCleaner;
import com.project.SpringClean.model.Customer;
import com.project.SpringClean.repository.CustomerRepository;
import com.project.SpringClean.security.JwtUtil;
import com.project.SpringClean.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private JwtUtil jwt;
    @Autowired
    private CustomerService customerService;


    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody Customer customer) {
        Customer saved = customerService.registerCustomer(customer);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CustomerLoginRequest request) {

        Customer customer = customerService.login(request.getEmail(), request.getPassword());

        String fakeToken = "token-" + customer.getCustomerId();

        // Success
        return ResponseEntity.ok(
                new CustomerLoginResponse(customer.getCustomerId() ,fakeToken,"Login Successful")
        );
    }

    @PutMapping("/{customerId}")
    public ResponseEntity<?> updateCustomerProfile(
            @PathVariable Long customerId,
            @RequestBody CustomerUpdateRequest req) {
        Customer updated = customerService.updateCustomer(customerId, req);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<?> getCustomer(@PathVariable Long customerId) {
        Customer customer = customerService.getCustomerById(customerId);
        return ResponseEntity.ok(customer);
    }
}
