package com.jobportal.abcjobs.repository;

import com.jobportal.abcjobs.model.ThreadEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ThreadsRepository extends JpaRepository<ThreadEntity, Long> {

}
