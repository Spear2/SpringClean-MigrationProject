package com.project.SpringClean.dto;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CustomerLoginResponse {
    private long customerId;
    private String token;
    private String message;

    public CustomerLoginResponse(long customerId, String token, String message) {
        this.customerId = customerId;
        this.token = token;
        this.message = message;
    }

}
