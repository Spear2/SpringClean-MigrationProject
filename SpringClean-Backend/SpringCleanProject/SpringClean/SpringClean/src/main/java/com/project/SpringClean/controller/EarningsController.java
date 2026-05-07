package com.project.SpringClean.controller;

import com.project.SpringClean.dto.EarningsDTO;
import com.project.SpringClean.dto.CompanyEarningsDTO;
import com.project.SpringClean.dto.EarningsSummaryDTO;
import com.project.SpringClean.service.EarningsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/earnings")
public class EarningsController {

    @Autowired
    private EarningsService earningsService;

    // Get all earnings for a cleaner
    @GetMapping("/cleaner/{cleanerId}")
    public List<EarningsDTO> getCleanerEarnings(@PathVariable Long cleanerId) {
        return earningsService.getCleanerEarnings(cleanerId);
    }

    // Get earnings summary for a cleaner
    @GetMapping("/cleaner/{cleanerId}/summary")
    public EarningsSummaryDTO getEarningsSummary(@PathVariable Long cleanerId) {
        return earningsService.getEarningsSummary(cleanerId);
    }

    @GetMapping("/company/{companyId}/summary")
    public CompanyEarningsDTO getCompanySummary(@PathVariable Long companyId) {
        return earningsService.getCompanyEarningsSummary(companyId);
    }
}