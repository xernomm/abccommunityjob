package com.jobportal.abcjobs.repository;

import com.jobportal.abcjobs.model.Jobs;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Jobs, Long> {
}
