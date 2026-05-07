package com.project.SpringClean.repository;

import com.project.SpringClean.model.Booking;
import com.project.SpringClean.model.Cleaner;
import com.project.SpringClean.model.CompanyCleaner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CleanerRepository extends JpaRepository<Cleaner, Long> {
    boolean existsByEmail(String email);
    Optional<Cleaner> findByEmail(String email);
    List<Cleaner> findByCompanyCleanerAndAvailableTrue(CompanyCleaner companyCleaner);
    List<Cleaner> findByCompanyCleaner(CompanyCleaner companyCleaner);
    List<Cleaner> findByCompanyCleanerAndAvailableTrueAndCleanerIdIn(
            CompanyCleaner companyCleaner,
            List<Long> cleanerIds
    );
    
}