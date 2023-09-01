package com.jobportal.abcjobs.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestBody {
    private String userName;
    private String email;
    private String password;
    private String address;
    private String phoneNumber;
    private int age;
    private String university;
    private String education;
    private String experience;
    private String bio;
}
