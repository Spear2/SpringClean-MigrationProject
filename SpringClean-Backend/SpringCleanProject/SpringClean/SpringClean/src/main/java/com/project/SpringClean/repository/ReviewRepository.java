package com.project.SpringClean.repository;

import com.project.SpringClean.model.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Reviews, Long> {
    List<Reviews> findByCustomer_customerId(Long customerId);
    List<Reviews> findByCompany_companyCleanerId(Long companyCleanerId);
    List<Reviews> findByCleaner_CleanerId(Long cleanerId);
    List<Reviews> findByCompany_CompanyCleanerId(Long companyCleanerId);

    @Query("SELECT AVG(r.rating) FROM Reviews r WHERE r.company.companyCleanerId = :companyId")
    Double getAvgRatingByCompany(Long companyId);

    @Query("SELECT COUNT(r) FROM Reviews r WHERE r.company.companyCleanerId = :companyId")
    Long getReviewCountByCompany(Long companyId);

    @Query("SELECT AVG(r.rating) FROM Reviews r WHERE r.cleaner.cleanerId = :cleanerId")
    Double getAvgRatingByCleaner(Long cleanerId);

    @Query("SELECT COUNT(r) FROM Reviews r WHERE r.cleaner.cleanerId = :cleanerId")
    Long getReviewCountByCleaner(Long cleanerId);
}