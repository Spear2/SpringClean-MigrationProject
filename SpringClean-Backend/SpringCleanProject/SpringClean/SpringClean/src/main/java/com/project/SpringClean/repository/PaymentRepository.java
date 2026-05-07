package com.project.SpringClean.repository;


import com.project.SpringClean.model.Booking;
import com.project.SpringClean.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByBooking_BookingId(Long bookingId);

    Payment findByBooking(Booking booking);
    List<Payment> findByBookingCustomerCustomerId(Long customerId);

    // Find all paid payments for completed bookings assigned to a specific cleaner
    @Query("SELECT p FROM Payment p JOIN p.booking b JOIN b.assignedCleaners c " +
            "WHERE c.cleanerId = :cleanerId AND p.status = 'Paid' AND b.status = 'Completed'")
    List<Payment> findCompletedPaymentsByCleaner(Long cleanerId);

    // Find all payments (any status) for a cleaner
    @Query("SELECT p FROM Payment p JOIN p.booking b JOIN b.assignedCleaners c " +
            "WHERE c.cleanerId = :cleanerId ORDER BY p.paidAt DESC")
    List<Payment> findAllPaymentsByCleaner(Long cleanerId);

    // Total earnings from paid & completed jobs
    @Query("SELECT SUM(p.amount) FROM Payment p JOIN p.booking b JOIN b.assignedCleaners c " +
            "WHERE c.cleanerId = :cleanerId AND p.status = 'Paid' AND b.status = 'Completed'")
    Double getTotalEarningsByCleaner(Long cleanerId);

    // Count completed jobs (paid & completed)
    @Query("SELECT COUNT(p) FROM Payment p JOIN p.booking b JOIN b.assignedCleaners c " +
            "WHERE c.cleanerId = :cleanerId AND p.status = 'Paid' AND b.status = 'Completed'")
    Long getCompletedJobsCount(Long cleanerId);

    // Count pending payments
    @Query("SELECT COUNT(p) FROM Payment p JOIN p.booking b JOIN b.assignedCleaners c " +
            "WHERE c.cleanerId = :cleanerId AND p.status = 'Paid' AND b.status != 'Completed'")
    Long getPendingPaymentsCount(Long cleanerId);

    @Query("SELECT p FROM Payment p " +
       "WHERE p.booking.companyCleaner.companyCleanerId = :companyId " +
       "AND p.status = 'Paid'")
     List<Payment> findPaymentsForCompany(Long companyId);
}
