package com.project.SpringClean.dto;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CleanerLoginRequest {
    private  String email;
    private String password;

    public CleanerLoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
