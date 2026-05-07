package com.project.SpringClean.dto;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CompanyCleanerLoginRequest {
    private String email;
    private String password;
}
