package com.jobportal.abcjobs.repository;

import com.jobportal.abcjobs.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}
