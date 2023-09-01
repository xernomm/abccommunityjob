package com.jobportal.abcjobs.repository;

import com.jobportal.abcjobs.model.ThreadComments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ThreadCommentsRepository extends JpaRepository<ThreadComments, Long> {
    int countByThreadEntityThreadId(Long threadId);
//    Optional<ThreadComments> findByComments(String threadComment);

}
