package com.jobportal.abcjobs.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userDetailsId;

    private String Address;
    private String phoneNumber;
    private int age;
    private String university;
    private String education;
    private String experience;
    private String bio;


}
