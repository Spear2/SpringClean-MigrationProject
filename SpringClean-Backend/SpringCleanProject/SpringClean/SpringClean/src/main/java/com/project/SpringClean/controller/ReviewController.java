package com.project.SpringClean.controller;

import com.project.SpringClean.dto.ReviewRequest;
import com.project.SpringClean.dto.ReviewResponse;
import com.project.SpringClean.model.Cleaner;
import com.project.SpringClean.model.CompanyCleaner;
import com.project.SpringClean.model.Customer;
import com.project.SpringClean.model.Reviews;
import com.project.SpringClean.repository.CleanerRepository;
import com.project.SpringClean.repository.CompanyCleanerRepository;
import com.project.SpringClean.repository.CustomerRepository;
import com.project.SpringClean.repository.ReviewRepository;
import com.project.SpringClean.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private CompanyCleanerRepository companyCleanerRepository;

    @Autowired
    private CleanerRepository cleanerRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ReviewRepository reviewRepository;


    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createReview(
            @RequestPart("data") ReviewRequest data,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {

        Reviews review = new Reviews();

        review.setReviewFor(data.getReviewFor());

        if (data.getReviewFor().equals("company")) {
            CompanyCleaner company = companyCleanerRepository.findById(data.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found"));
            review.setCompany(company);
            review.setCleaner(null);
        }

        if (data.getReviewFor().equals("cleaner")) {
            Cleaner cleaner = cleanerRepository.findById(data.getCleanerId())
                    .orElseThrow(() -> new RuntimeException("Cleaner not found"));
            review.setCleaner(cleaner);
            review.setCompany(null);
        }

        Customer customer = customerRepository.findById(data.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        review.setCustomer(customer);

        review.setRating(data.getRating());
        review.setText(data.getText());
        review.setDate(LocalDate.now());
        review.setTime(LocalTime.now());

        Reviews saved = reviewService.saveReview(review);

        return ResponseEntity.ok(saved);
    }


    @GetMapping("/customer/{customerId}")
    public List<Reviews> getCustomerReviews(@PathVariable Long customerId) {
        return reviewService.getReviewsByCustomer(customerId);
    }


    @GetMapping("/company/{companyId}/rating")
    public Map<String, Object> getCompanyRating(@PathVariable Long companyId) {
        Double avg = reviewService.getCompanyAvgRating(companyId);
        Long count = reviewService.getCompanyReviewCount(companyId);

        Map<String, Object> res = new HashMap<>();
        res.put("avgRating", avg != null ? avg : 0);
        res.put("totalReviews", count);

        return res;
    }

    @GetMapping("/cleaner/{cleanerId}/rating")
    public Map<String, Object> getCleanerRating(@PathVariable Long cleanerId) {
        Double avg = reviewService.getCleanerAvgRating(cleanerId);
        Long count = reviewService.getCleanerReviewCount(cleanerId);

        Map<String, Object> res = new HashMap<>();
        res.put("avgRating", avg != null ? avg : 0);
        res.put("totalReviews", count);

        return res;
    }

    // @GetMapping("/company/{companyId}")
    // public List<ReviewResponse> getCompanyReviews(@PathVariable Long companyId) {
    //     return reviewService.getReviewsByCompany(companyId)
    //             .stream()
    //             .map(reviewService::toDTO)
    //             .toList();
    // }

    @GetMapping("/cleaner/{cleanerId}")
    public List<ReviewResponse> getCleanerReviews(@PathVariable Long cleanerId) {
        return reviewService.getReviewsByCleaner(cleanerId);
    }

    @GetMapping("/company/{companyId}")
    public List<Reviews> getReviewsForCompany(@PathVariable Long companyId) {
        return reviewService.getReviewsForCompany(companyId);
    }


}

