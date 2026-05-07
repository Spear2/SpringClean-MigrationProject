package com.project.SpringClean.repository;

import com.project.SpringClean.model.CompanyCleaner;
import com.project.SpringClean.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyCleanerRepository extends JpaRepository<CompanyCleaner, Long> {
    boolean existsByEmail(String email);
    Optional<CompanyCleaner> findByEmail(String email);
}
