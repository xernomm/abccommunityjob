package com.jobportal.abcjobs.service;

import com.jobportal.abcjobs.model.CommentReply;
import com.jobportal.abcjobs.repository.ThreadCommentReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class ThreadCommentReplyService {
    @Autowired
    private ThreadCommentReplyRepository threadCommentReplyRepository;

    public CommentReply saveReply(CommentReply commentReply){
        return threadCommentReplyRepository.save(commentReply);
    }

    public List<CommentReply> allReply(){
        return threadCommentReplyRepository.findAll();
    }

    public int getReplyCountForComment(Long commentId) {
        return threadCommentReplyRepository.countByThreadCommentsCommentId(commentId);
    }

}
