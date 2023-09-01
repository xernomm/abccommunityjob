package com.jobportal.abcjobs.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThreadComments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;
    private String comment;
    private LocalDateTime commentDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "threadComments", cascade = CascadeType.ALL)
    private List<CommentReply> commentReply = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "thread_id")
    private ThreadEntity threadEntity;
}
