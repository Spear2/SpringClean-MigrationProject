package com.project.SpringClean.service;

import com.project.SpringClean.dto.CompanyEarningsDTO;
import com.project.SpringClean.dto.EarningsDTO;
import com.project.SpringClean.dto.EarningsSummaryDTO;
import com.project.SpringClean.model.Payment;
import com.project.SpringClean.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EarningsService {

    private static final double CLEANER_COMMISSION_RATE = 0.80; // 80%
    private static final double COMPANY_COMMISSION_RATE = 0.20; // 20%

    @Autowired
    private PaymentRepository paymentRepository;

    public double calculateCleanerEarnings(double totalAmount) {
        return totalAmount * CLEANER_COMMISSION_RATE;
    }

    public double calculateCompanyCommission(double totalAmount) {
        return totalAmount * COMPANY_COMMISSION_RATE;
    }

    public List<EarningsDTO> getCleanerEarnings(Long cleanerId) {
        List<Payment> payments = paymentRepository.findAllPaymentsByCleaner(cleanerId);

        return payments.stream().map(payment -> {
            EarningsDTO dto = new EarningsDTO();
            dto.setPaymentId(payment.getPaymentId());
            dto.setBookingId(payment.getBooking().getBookingId());
            dto.setCustomerFirstName(payment.getBooking().getCustomer().getFirstName());
            dto.setCustomerLastName(payment.getBooking().getCustomer().getLastName());
            dto.setServiceType(payment.getBooking().getServiceType());
            dto.setTotalAmount(payment.getAmount());

            // Only calculate earnings for Paid payments with Completed bookings
            if ("Paid".equals(payment.getStatus()) &&
                    "Completed".equals(payment.getBooking().getStatus())) {
                dto.setCleanerEarnings(calculateCleanerEarnings(payment.getAmount()));
                dto.setCompanyCommission(calculateCompanyCommission(payment.getAmount()));
            } else {
                dto.setCleanerEarnings(0.0);
                dto.setCompanyCommission(0.0);
            }

            dto.setStatus(payment.getStatus());
            dto.setPaidAt(payment.getPaidAt());
            return dto;
        }).collect(Collectors.toList());
    }

    public EarningsSummaryDTO getEarningsSummary(Long cleanerId) {
        List<Payment> completedPayments = paymentRepository.findCompletedPaymentsByCleaner(cleanerId);

        double totalRevenue = completedPayments.stream()
                .mapToDouble(Payment::getAmount)
                .sum();

        double totalEarnings = calculateCleanerEarnings(totalRevenue);
        double companyCommission = calculateCompanyCommission(totalRevenue);

        Long completedJobs = paymentRepository.getCompletedJobsCount(cleanerId);
        Long pendingPayments = paymentRepository.getPendingPaymentsCount(cleanerId);

        return new EarningsSummaryDTO(
                totalEarnings,
                totalRevenue,
                companyCommission,
                completedJobs != null ? completedJobs : 0,
                pendingPayments != null ? pendingPayments : 0
        );
    }

    public CompanyEarningsDTO getCompanyEarningsSummary(Long companyId) {
    List<Payment> payments = paymentRepository.findPaymentsForCompany(companyId);

    double totalRevenue = payments.stream()
        .mapToDouble(Payment::getAmount)
        .sum();

    double companyCommission = totalRevenue * COMPANY_COMMISSION_RATE;

    return new CompanyEarningsDTO(companyCommission, totalRevenue);
    }
}