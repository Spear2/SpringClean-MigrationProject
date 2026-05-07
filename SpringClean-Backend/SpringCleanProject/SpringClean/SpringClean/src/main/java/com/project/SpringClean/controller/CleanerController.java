package com.project.SpringClean.controller;


import com.project.SpringClean.dto.CleanerLoginRequest;
import com.project.SpringClean.dto.CleanerLoginResponse;
import com.project.SpringClean.dto.CleanerRegistration;
import com.project.SpringClean.model.Booking;
import com.project.SpringClean.model.Cleaner;

import com.project.SpringClean.model.CompanyCleaner;
import com.project.SpringClean.model.Customer;
import com.project.SpringClean.repository.BookingRepository;
import com.project.SpringClean.repository.CleanerRepository;
import com.project.SpringClean.service.BookingService;
import com.project.SpringClean.service.CleanerService;
import com.project.SpringClean.service.CompanyCleanerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cleaners")
@CrossOrigin("http://localhost:3000")
public class CleanerController  {
    @Autowired
    private CleanerService cleanerService;

    @Autowired
    private CleanerRepository cleanerRepository;
    @Autowired
    private BookingService bookingService;
    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CleanerRegistration dto) {
        Cleaner saved = cleanerService.registerCleaner(dto);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CleanerLoginRequest dto) {
        Cleaner cleaner = cleanerService.login(dto.getEmail(), dto.getPassword());
        String fakeToken = "token-" + cleaner.getCleanerId();

        return ResponseEntity.ok(
                new CleanerLoginResponse(cleaner.getCleanerId(), fakeToken, "Login Successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCleaner(@PathVariable Long id) {
        Cleaner cleaner = cleanerService.getCleanerById(id);
        return ResponseEntity.ok(cleaner);
    }

    @GetMapping("/{cleanerId}/bookings")
    public ResponseEntity<?> getCleanerAssignedBookings(@PathVariable Long cleanerId) {
        List<Booking> bookings = bookingService.getCleanerBookings(cleanerId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping
    public List<Cleaner> getAllCleaners() {
        return cleanerService.getAllCleaners();
    }

}