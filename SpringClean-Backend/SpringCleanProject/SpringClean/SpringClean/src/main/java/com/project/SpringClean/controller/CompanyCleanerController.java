package com.project.SpringClean.controller;

import com.project.SpringClean.dto.CompanyCleanerLoginRequest;
import com.project.SpringClean.dto.CompanyCleanerLoginResponse;
import com.project.SpringClean.dto.CompanyCleanerCardResponse;
import com.project.SpringClean.dto.CompanyCleanerProfileResponse;
import com.project.SpringClean.model.CompanyCleaner;
import com.project.SpringClean.repository.CompanyCleanerRepository;
import com.project.SpringClean.security.JwtUtil;
import com.project.SpringClean.service.CompanyCleanerService;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.project.SpringClean.model.Cleaner;
import com.project.SpringClean.repository.CleanerRepository;

import java.util.List;

@RestController
@RequestMapping("/api/company-cleaners")
@CrossOrigin("http://localhost:3000")
public class CompanyCleanerController {

    @Autowired
    private CompanyCleanerService companyCleanerService;

    @Autowired
    JwtUtil jwt;

    @Autowired
    private CompanyCleanerRepository companyCleanerRepository;


    @Autowired
    private CleanerRepository cleanerRepo;

    private CompanyCleanerProfileResponse toProfileResponse(CompanyCleaner company) {
        return new CompanyCleanerProfileResponse(
                company.getCompanyCleanerId(),
                company.getCompanyName(),
                company.getEmail(),
                company.getPhoneNumber(),
                company.getAddress(),
                company.getTagline(),
                company.getAbout(),
                company.getRating(),
                company.getEmployees(),
                company.getProjects()
        );
    }

    @GetMapping
    public List<CompanyCleanerCardResponse> getAllCompanyCleaners() {
        return companyCleanerService.getAllCompanyCleaners()
                .stream()
                .map(company -> new CompanyCleanerCardResponse(
                        company.getCompanyCleanerId(),
                        company.getCompanyName(),
                        company.getAddress(),
                        company.getAbout()
                ))
                .toList();
    }



    @PostMapping("/register")
    public ResponseEntity<CompanyCleaner> registerCompany(@RequestBody CompanyCleaner companyCleaner) {
        CompanyCleaner saved = companyCleanerService.registerCompanyCleaner(companyCleaner);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CompanyCleanerLoginRequest request) {
        CompanyCleaner cleaner = companyCleanerService.login(request.getEmail(), request.getPassword());

        String fakeToken = "token-" + cleaner.getCompanyCleanerId();  // For now, manually generate

        return ResponseEntity.ok(
                new CompanyCleanerLoginResponse(
                        cleaner.getCompanyCleanerId(),
                        fakeToken,
                        "Login successful"
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCleaner(@PathVariable Long id) {
        CompanyCleaner cleaner = companyCleanerService.getCompanyCleanerById(id);
        return ResponseEntity.ok(toProfileResponse(cleaner));
    }

    @GetMapping("/{companyId}/cleaners")
    public ResponseEntity<?> getCompanyCleaners(@PathVariable Long companyId) {
        CompanyCleaner company = companyCleanerService.getCompanyCleanerById(companyId);
        List<Cleaner> cleaners = cleanerRepo.findByCompanyCleaner(company);
        return ResponseEntity.ok(cleaners);
    }

     @PutMapping("/update/{id}")
    public CompanyCleanerProfileResponse updateCompany(
            @PathVariable Long id,
            @RequestBody CompanyCleaner updated
    ) {
        CompanyCleaner saved = companyCleanerService.updateCompanyProfile(id, updated);
        return toProfileResponse(saved);
    }

    @GetMapping("/current")
    public ResponseEntity<CompanyCleanerProfileResponse> getCurrentCompany(HttpSession session) {
        Long companyId = (Long) session.getAttribute("companyId");
        if (companyId == null) {
            return ResponseEntity.badRequest().build();
        }

        CompanyCleaner company = companyCleanerService.getCompanyCleanerById(companyId);
        company = companyCleanerService.enrichCompanyStats(company);
        return ResponseEntity.ok(toProfileResponse(company));
    }




}
