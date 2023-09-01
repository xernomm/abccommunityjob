package com.jobportal.abcjobs.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Jobs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;

    private String jobName;
    private String company;
    private String companyMail;
    private String jobDescription;
    private String jobUploader;
    private String companyContact;
    private LocalDateTime jobUploadedTime;
    private int salary;
    private int quota;

    @ManyToMany(mappedBy = "jobsApplied") // Correcting the mappedBy attribute
    private List<User> applicants = new ArrayList<>(); // Users who applied for this job

    @JsonIgnore
    @OneToMany(mappedBy = "jobs", cascade = CascadeType.ALL)
    private List<AppliedUser> newApplicants = new ArrayList<>();

    private boolean isFull;
    public void updateIsFull() {
        if (applicants.size() >= quota) {
            isFull = true;
        } else {
            isFull = false;
        }
    }

}
