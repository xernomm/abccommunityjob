package com.jobportal.abcjobs.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppliedUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applyingId;

    @ManyToOne
    @JoinColumn(name = "user_user_id")// Establishing Many-to-One relationship
    private User user;

    @ManyToOne
    @JoinColumn(name = "jobs_job_id")// Establishing Many-to-One relationship
    private Jobs jobs;

    private boolean isAccepted;
}
