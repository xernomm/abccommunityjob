package com.jobportal.abcjobs.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostJobRequestBody {
    private String jobName;
    private String company;
    private String companyMail;
    private String jobDescription;
    private String jobUploader;
    private String companyContact;
    private int salary;
    private int quota;

}
