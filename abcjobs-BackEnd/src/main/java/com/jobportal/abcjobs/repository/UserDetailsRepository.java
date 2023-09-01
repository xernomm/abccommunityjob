package com.jobportal.abcjobs.repository;

import com.jobportal.abcjobs.model.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailsRepository extends JpaRepository<UserDetails, Long> {
}
