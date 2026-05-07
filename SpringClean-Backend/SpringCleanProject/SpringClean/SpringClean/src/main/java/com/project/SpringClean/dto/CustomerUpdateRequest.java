package com.project.SpringClean.dto;


import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class CustomerUpdateRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
}
