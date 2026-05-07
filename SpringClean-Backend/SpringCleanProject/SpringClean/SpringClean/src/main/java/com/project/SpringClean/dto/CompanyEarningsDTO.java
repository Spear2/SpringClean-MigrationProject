package com.project.SpringClean.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CompanyEarningsDTO {
    private double companyCommission;
    private double totalRevenue;
    
}
