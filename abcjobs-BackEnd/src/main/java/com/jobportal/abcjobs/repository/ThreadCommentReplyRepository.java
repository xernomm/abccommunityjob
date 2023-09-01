package com.jobportal.abcjobs.repository;

import com.jobportal.abcjobs.model.CommentReply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ThreadCommentReplyRepository extends JpaRepository<CommentReply, Long> {
//    Optional<CommentReply> findByCommentReply(String commentReply);
int countByThreadCommentsCommentId(Long commentId);

}
