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
public class ThreadEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long threadId;
    private String threadHeader;
    private String threadBody;
    private String hashtags;
    private LocalDateTime threadDate;

    @Lob
    private byte[] threadImage;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "threadEntity", cascade = CascadeType.ALL) // Update the mappedBy attribute here
    private List<ThreadComments> threadComments = new ArrayList<>();


}
