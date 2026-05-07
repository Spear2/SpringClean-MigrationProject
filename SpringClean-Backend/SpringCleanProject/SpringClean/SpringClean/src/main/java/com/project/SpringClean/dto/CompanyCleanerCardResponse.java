package com.project.SpringClean.dto;

public record CompanyCleanerCardResponse(
        Long companyCleanerId,
        String companyName,
        String location,
        String description
) {
}
