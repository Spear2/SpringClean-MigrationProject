package com.project.SpringClean.dto;

public record CompanyCleanerProfileResponse(
        Long companyCleanerId,
        String companyName,
        String email,
        String phoneNumber,
        String address,
        String tagline,
        String about,
        String rating,
        String employees,
        String projects
) {
}
