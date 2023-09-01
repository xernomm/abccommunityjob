package com.jobportal.abcjobs.service;

import com.jobportal.abcjobs.model.ThreadEntity;
import com.jobportal.abcjobs.repository.ThreadsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ThreadsService {

    @Autowired
    private ThreadsRepository threadsRepository;

    public ThreadEntity saveThread(ThreadEntity threadEntity){
        return threadsRepository.save(threadEntity);
    }

    public ThreadEntity saveThreadWithImage(ThreadEntity threadEntity, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            threadEntity.setThreadImage(imageFile.getBytes());
        }
        return threadsRepository.save(threadEntity);
    }

    public void deleteThread(Long threadId){
       ThreadEntity idThread = threadsRepository.findById(threadId)
               .orElseThrow(() -> new IllegalArgumentException(String.valueOf(threadId) + "not found"));
        threadsRepository.delete(idThread);
    }
    public List<ThreadEntity> getAllThreads(){
        return threadsRepository.findAll();
    }

}
