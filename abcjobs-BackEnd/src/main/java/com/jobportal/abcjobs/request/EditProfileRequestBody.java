package com.jobportal.abcjobs.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditProfileRequestBody {
    private String userName;
    private String address;
    private String phoneNumber;
    private int age;
    private String university;
    private String education;
    private String experience;
    private String bio;
}
