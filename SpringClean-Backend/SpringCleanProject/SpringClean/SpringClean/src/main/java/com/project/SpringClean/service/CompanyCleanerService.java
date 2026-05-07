package com.project.SpringClean.service;

import com.project.SpringClean.dto.CompanyEarningsDTO;
import com.project.SpringClean.model.CompanyCleaner;
import com.project.SpringClean.model.Payment;
import com.project.SpringClean.repository.BookingRepository;
import com.project.SpringClean.repository.CompanyCleanerRepository;
import com.project.SpringClean.repository.PaymentRepository;
import com.project.SpringClean.serviceinterface.CompanyCleanerServiceInt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyCleanerService implements CompanyCleanerServiceInt {

    @Autowired
    private CompanyCleanerRepository companyCleanerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<CompanyCleaner> getAllCompanyCleaners() {
        return companyCleanerRepository.findAll();
    }

    @Override
    public CompanyCleaner registerCompanyCleaner(CompanyCleaner cleaner) {
        if (companyCleanerRepository.existsByEmail(cleaner.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        cleaner.setPassword(passwordEncoder.encode(cleaner.getPassword()));
        return companyCleanerRepository.save(cleaner);
    }

    private static final double CLEANER_COMMISSION_RATE = 0.80; // 80%
    private static final double COMPANY_COMMISSION_RATE = 0.20; // 20%

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public CompanyCleaner login(String email, String password) {
        CompanyCleaner cleaner = companyCleanerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        if(email == null || password == null) {
            throw new RuntimeException("Fields Should not be empty");
        }

        boolean validPassword = passwordEncoder.matches(password, cleaner.getPassword());

        // Backward compatibility: allow old plaintext users and migrate to hashed.
        if (!validPassword && password.equals(cleaner.getPassword())) {
            cleaner.setPassword(passwordEncoder.encode(password));
            companyCleanerRepository.save(cleaner);
            validPassword = true;
        }

        if (!validPassword) {
            throw new RuntimeException("Incorrect password");
        }

        return cleaner;
    }

    @Override
    public CompanyCleaner getCompanyCleanerById(Long id) {
        return companyCleanerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }

    public CompanyEarningsDTO getCompanyEarningsSummary(Long companyId) {
    List<Payment> payments = paymentRepository.findPaymentsForCompany(companyId);

    double totalRevenue = payments.stream()
        .mapToDouble(Payment::getAmount)
        .sum();

    double companyCommission = totalRevenue * COMPANY_COMMISSION_RATE;

    return new CompanyEarningsDTO(companyCommission, totalRevenue);
    }

    public CompanyCleaner enrichCompanyStats(CompanyCleaner company) {
        int numberOfCleaners = company.getCleaners() != null ? company.getCleaners().size() : 0;
        Long numberOfProjects = bookingRepository.countByCompanyCleaner(company); // adjust query
        Double avgRating = reviewService.getCompanyAvgRating(company.getCompanyCleanerId());

        company.setEmployees(String.valueOf(numberOfCleaners));
        company.setProjects(String.valueOf(numberOfProjects));
        company.setRating(avgRating != null ? String.format("%.1f", avgRating) : "0.0");

        return company;
    }

    public CompanyCleaner updateCompanyProfile(Long id, CompanyCleaner updated) {
    CompanyCleaner company = companyCleanerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Company not found"));

    company.setCompanyName(updated.getCompanyName());
    company.setTagline(updated.getTagline());
    company.setAddress(updated.getAddress());
    company.setPhoneNumber(updated.getPhoneNumber());
    company.setEmail(updated.getEmail());
    company.setAbout(updated.getAbout());
    company.setServices(updated.getServices());
    company.setWhyUs(updated.getWhyUs());

    // Automatically recalculate stats
    company = enrichCompanyStats(company);

    return companyCleanerRepository.save(company);


}

}
