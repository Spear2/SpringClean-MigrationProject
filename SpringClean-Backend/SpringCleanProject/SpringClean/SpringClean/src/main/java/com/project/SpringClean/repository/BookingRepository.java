package com.project.SpringClean.repository;



import com.project.SpringClean.model.Booking;
import com.project.SpringClean.model.CompanyCleaner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer_CustomerId(Long customerId);
    @Query("SELECT DISTINCT b FROM Booking b " +
            "JOIN FETCH b.customer " +
            "JOIN FETCH b.companyCleaner " +
            "LEFT JOIN FETCH b.assignedCleaners " +
            "WHERE b.customer.customerId = :customerId")
    List<Booking> findByCustomerWithDetails(@Param("customerId") Long customerId);
    List<Booking> findByCompanyCleaner_CompanyCleanerId(Long companyCleanerId);
    List<Booking> findByCompanyCleanerAndBookingDate(CompanyCleaner companyCleaner, LocalDate bookingDate);
    List<Booking> findByAssignedCleaners_CleanerIdAndBookingDate(Long cleanerId, LocalDate date);
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.assignedCleaners WHERE b.companyCleaner.companyCleanerId = :companyId")
    List<Booking> findByCompanyCleanerWithCleaners(@Param("companyId") Long companyId);
    @Query("SELECT b FROM Booking b JOIN b.assignedCleaners c WHERE c.cleanerId = :cleanerId")
    List<Booking> findBookingsByCleanerId(Long cleanerId);
    @Query("SELECT b FROM Booking b JOIN b.assignedCleaners c WHERE c.cleanerId = :cleanerId AND b.customer.customerId = :customerId")
    List<Booking> findBookingsByCleanerAndCustomer(Long cleanerId, Long customerId);
    Long countByCompanyCleaner(CompanyCleaner company);

}

