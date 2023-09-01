package com.jobportal.abcjobs.service;

import com.jobportal.abcjobs.model.UserDetails;
import com.jobportal.abcjobs.repository.UserDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class UserDetailsService {

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    public UserDetails saveDetails(UserDetails userDetails) {
        return userDetailsRepository.save(userDetails);
    }

}
