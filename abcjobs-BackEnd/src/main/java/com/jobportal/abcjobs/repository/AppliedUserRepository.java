package com.jobportal.abcjobs.repository;

import com.jobportal.abcjobs.model.AppliedUser;
import com.jobportal.abcjobs.model.Jobs;
import com.jobportal.abcjobs.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AppliedUserRepository extends JpaRepository<AppliedUser, Long> {
    boolean existsByUserAndJobs(User user, Jobs job);

    @Query("SELECT au FROM AppliedUser au WHERE au.jobs.jobId = :jobId")
    Optional<AppliedUser> findByJobId(@Param("jobId") Long jobId);

    void deleteByJobs_JobId(Long jobId);
}

