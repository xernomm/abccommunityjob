package com.jobportal.abcjobs.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostThreadRequestBody {
    private String threadHeader;
    private String threadBody;
    private String hashtags;
    private MultipartFile threadImage;
}
