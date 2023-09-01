package com.jobportal.abcjobs.service;

import com.jobportal.abcjobs.model.AppliedUser;
import com.jobportal.abcjobs.model.Jobs;
import com.jobportal.abcjobs.repository.AppliedUserRepository;
import com.jobportal.abcjobs.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PostJobService {
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private AppliedUserRepository appliedUserRepository;

    public Jobs saveJob(Jobs jobs){
        return jobRepository.save(jobs);
    }

    public List<Jobs> allJobs(){
        return jobRepository.findAll();
    }

    public void deleteJobs(Long jobId){
        Jobs job = jobRepository.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Job not found"));
        jobRepository.delete(job);
    }
}
