package com.jobportal.abcjobs.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseData<T> {

    private boolean status;
    private String message;
    private T payLoad;

    public ResponseData() {

    }

}
