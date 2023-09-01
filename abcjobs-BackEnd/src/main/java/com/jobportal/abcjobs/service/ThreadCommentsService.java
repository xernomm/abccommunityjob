package com.jobportal.abcjobs.service;

import com.jobportal.abcjobs.model.ThreadComments;
import com.jobportal.abcjobs.model.ThreadEntity;
import com.jobportal.abcjobs.repository.ThreadCommentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class ThreadCommentsService {
    @Autowired
    private final ThreadCommentsRepository commentsRepository;

    public ThreadCommentsService(ThreadCommentsRepository commentsRepository) {
        this.commentsRepository = commentsRepository;
    }

    public ThreadComments saveComment(ThreadComments threadComments){
        return commentsRepository.save(threadComments);
    }

    public List<ThreadComments> allComments(){
        return commentsRepository.findAll();
    }

    public int getCommentCountForThread(Long threadId) {
        return commentsRepository.countByThreadEntityThreadId(threadId);
    }

    public void deleteComment(Long commentId){
        ThreadComments idComment = commentsRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException(String.valueOf(commentId) + "not found"));
        commentsRepository.delete(idComment);
    }


}
