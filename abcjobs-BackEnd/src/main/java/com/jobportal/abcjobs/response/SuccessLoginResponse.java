package com.jobportal.abcjobs.response;


import com.jobportal.abcjobs.model.ThreadEntity;
import com.jobportal.abcjobs.model.UserDetails;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SuccessLoginResponse {
    private String token;
    private String name;
    private String email;
    private int roleId;
    private boolean isSuspended;
    private UserDetails userDetails;
    private List<ThreadEntity> threadEntity;


}
