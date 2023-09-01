package com.jobportal.abcjobs.service;

import com.jobportal.abcjobs.model.AppliedUser;
import com.jobportal.abcjobs.model.ThreadComments;
import com.jobportal.abcjobs.repository.AppliedUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class AppliedUserService {
    @Autowired
    private AppliedUserRepository appliedUserRepository;

    public AppliedUser saveNewApplicant(AppliedUser appliedUser){
        return appliedUserRepository.save(appliedUser);
    }

    public List<AppliedUser> getAllApplicants(){
        return appliedUserRepository.findAll();
    }

    public void deleteApplicant(Long applicantId){
        AppliedUser idApplicant = appliedUserRepository.findById(applicantId)
                .orElseThrow(() -> new IllegalArgumentException(String.valueOf(applicantId) + "not found"));
        appliedUserRepository.delete(idApplicant);
    }


}
