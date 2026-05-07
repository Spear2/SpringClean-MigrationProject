package com.project.SpringClean.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CustomerLoginRequest {
    private String email;
    private String password;

}
