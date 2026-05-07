package com.project.SpringClean.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CompanyCleanerLoginResponse {

    private long companyCleanerId;
    private String token;
    private String message;

    public CompanyCleanerLoginResponse(long companyCleanerId, String token, String message) {
        this.companyCleanerId = companyCleanerId;
        this.token = token;
        this.message = message;
    }


}
