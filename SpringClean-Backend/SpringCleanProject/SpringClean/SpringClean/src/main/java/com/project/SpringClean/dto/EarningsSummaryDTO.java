package com.project.SpringClean.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EarningsSummaryDTO {
    private double totalEarnings; // Total cleaner earnings (80%)
    private double totalRevenue; // Total payment amounts
    private double companyCommission; // Total company commission (20%)
    private long completedJobs;
    private long pendingPayments;
}
