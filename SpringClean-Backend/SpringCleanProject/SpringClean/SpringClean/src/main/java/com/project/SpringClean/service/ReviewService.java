package com.project.SpringClean.service;

import com.project.SpringClean.dto.ReviewResponse;
import com.project.SpringClean.model.Reviews;
import com.project.SpringClean.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepo;

    public Reviews saveReview(Reviews review) {
        return reviewRepo.save(review);
    }

    public List<Reviews> getReviewsByCustomer(Long customerId) {
        return reviewRepo.findByCustomer_customerId(customerId);
    }

    public List<Reviews> getReviewsForCompany(Long companyId) {
        return reviewRepo.findByCompany_companyCleanerId(companyId);
    }

    public List<Reviews> getReviewsForCleaner(Long cleanerId) {
        return reviewRepo.findByCleaner_CleanerId(cleanerId);
    }

    public Double getCompanyAvgRating(Long companyId) {
        return reviewRepo.getAvgRatingByCompany(companyId);
    }

    public Long getCompanyReviewCount(Long companyId) {
        return reviewRepo.getReviewCountByCompany(companyId);
    }

    public Double getCleanerAvgRating(Long cleanerId) {
        return reviewRepo.getAvgRatingByCleaner(cleanerId);
    }

    public Long getCleanerReviewCount(Long cleanerId) {
        return reviewRepo.getReviewCountByCleaner(cleanerId);
    }

    public List<Reviews> getReviewsByCompany(Long companyId) {
        return reviewRepo.findByCompany_CompanyCleanerId(companyId);
    }

    public ReviewResponse toDTO(Reviews review) {
        ReviewResponse dto = new ReviewResponse();

        dto.setReviewId(review.getId());
        dto.setReviewFor(review.getReviewFor());
        dto.setRating(review.getRating());
        dto.setText(review.getText());

        dto.setCustomerId(review.getCustomer().getCustomerId());
        dto.setCustomerName(review.getCustomer().getFirstName() + " " + review.getCustomer().getLastName());

        // If review is for company
        if (review.getCompany() != null) {
            dto.setCompanyName(review.getCompany().getCompanyName());
        }

        // If review is for a cleaner
        if (review.getCleaner() != null) {
            dto.setCleanerName(review.getCleaner().getCleanerName());
        }

        // Format date/time to string
        dto.setDate(review.getDate() != null ? review.getDate().toString() : null);
        dto.setTime(review.getTime() != null ? review.getTime().toString() : null);

        return dto;
    }


    public List<ReviewResponse> getReviewsByCleaner(Long cleanerId) {
        return reviewRepo.findByCleaner_CleanerId(cleanerId)
                .stream()
                .map(this::toCleanerDTO)
                .toList();
    }

    public ReviewResponse toCleanerDTO(Reviews r) {
        ReviewResponse dto = new ReviewResponse();

        dto.setReviewId(r.getId());

        if (r.getCleaner() != null) {
            dto.setCleanerId(r.getCleaner().getCleanerId());
            dto.setCleanerName(r.getCleaner().getCleanerName());
        }

        dto.setCustomerId(r.getCustomer().getCustomerId());
        dto.setCustomerName(r.getCustomer().getFirstName() + " " + r.getCustomer().getLastName());

        dto.setRating(r.getRating());
        dto.setText(r.getText());

        dto.setDate(r.getDate() != null ? r.getDate().toString() : null);
        dto.setTime(r.getTime() != null ? r.getTime().toString() : null);

        return dto;
    }

}

